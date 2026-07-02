import prisma from "../prisma";

let isSyncing = false;

interface DayHeader {
  x: number;
  y: number;
  text: string;
  dayName: string;
  dateText: string;
  date: Date;
  slideId: string;
}

interface EventBlock {
  x: number;
  y: number;
  text: string;
  slideId: string;
}

interface RawParsedElement {
  id: string;
  slideId: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const DEFAULT_SLIDES_URL = "https://docs.google.com/presentation/d/e/2PACX-1vQwYAg7nlafXZXTGUYoIOrcLlCwkkPE97bd7Y5380P1_x7W4tTutD8Rq7JwdTKrDQBlnPoxBD3HcfMQ/pub?start=true&loop=true&delayms=10000&slide=id.g3a9806a7f21_3_75";

function parseIndonesianDate(dayName: string, dateStr: string): Date {
  const cleaned = dateStr.replace(/(\d+)([a-zA-Z]+)/, "$1 $2").trim();
  const parts = cleaned.split(/\s+/);
  const day = parseInt(parts[0]) || 1;
  const monthName = (parts[1] || "").toLowerCase();
  const year = parseInt(parts[2]) || new Date().getFullYear();

  const months: Record<string, number> = {
    januari: 0, februari: 1, maret: 2, april: 3, mei: 4, juni: 5,
    juli: 6, agustus: 7, september: 8, oktober: 9, november: 10, desember: 11
  };

  const month = months[monthName] ?? 0;
  return new Date(year, month, day, 7, 0, 0); // Default to 7 AM local WIB
}

function parseBbox(dPath: string) {
  const match = dPath.match(/m\s*([\d.-]+)\s+([\d.-]+)\s*l\s*([\d.-]+)\s+([\d.-]+)\s*l\s*([\d.-]+)\s+([\d.-]+)/i);
  if (match) {
    const startX = parseFloat(match[1] || "0");
    const startY = parseFloat(match[2] || "0");
    const dx1 = parseFloat(match[3] || "0");
    const dy1 = parseFloat(match[4] || "0");
    const dx2 = parseFloat(match[5] || "0");
    const dy2 = parseFloat(match[6] || "0");

    let width = 0;
    let height = 0;
    if (dx1 === 0) {
      height = Math.abs(dy1);
      width = Math.abs(dx2);
    } else {
      width = Math.abs(dx1);
      height = Math.abs(dy2);
    }
    return { x: startX, y: startY, width, height };
  }
  return null;
}

export async function syncSlidesData() {
  if (isSyncing) {
    console.log("[Slides Scraper] Synchronization already in progress, skipping...");
    return { success: false, message: "Sync already in progress" };
  }

  isSyncing = true;
  console.log("[Slides Scraper] Fetching active Google Slides URL...");

  try {
    const dbUrlSetting = await prisma.systemSetting.findUnique({
      where: { key: "agenda_slides_url" }
    });
    const slidesUrl = dbUrlSetting?.value || DEFAULT_SLIDES_URL;
    console.log(`[Slides Scraper] Syncing from URL: ${slidesUrl}`);

    const response = await fetch(slidesUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch Google Slides HTML: ${response.statusText}`);
    }
    let htmlContent = await response.text();

    htmlContent = htmlContent
      .replace(/\\x22/g, '"')
      .replace(/\\x27/g, "'")
      .replace(/\\x3d/g, "=")
      .replace(/\\x3c/g, "<")
      .replace(/\\x3e/g, ">");

    htmlContent = htmlContent.replace(/\\u([0-9a-fA-F]{4})/g, (_, grp) => {
      return String.fromCharCode(parseInt(grp, 16));
    });

    const elementRegex = /<g id="(a11y-[a-zA-Z0-9]+_[^"]+)" role="img" aria-label="([^"]+)"[^>]*>[\s\S]*?<path[^>]*d="([^"]+)"/g;
    
    const rawElements: RawParsedElement[] = [];
    const cutiSlideIds = new Set<string>();

    const dayNames = ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"];
    const monthNames = ["januari", "februari", "maret", "april", "mei", "juni", "juli", "agustus", "september", "oktober", "november", "desember"];

    let match;
    while ((match = elementRegex.exec(htmlContent)) !== null) {
      const elemId = match[1] || "";
      const slideIdMatch = elemId.match(/a11y-([a-zA-Z0-9]+)_\d+_\d+/);
      const slideId = slideIdMatch ? slideIdMatch[1] || "" : "";
      let label = match[2] || "";
      const dPath = match[3] || "";

      label = label
        .replace(/&#xa;/g, "\n")
        .replace(/\\x26#xa;/g, "\n")
        .replace(/&amp;/g, "&")
        .trim();

      const bbox = parseBbox(dPath);
      if (!bbox) continue;

      rawElements.push({
        id: elemId,
        slideId,
        label,
        x: bbox.x,
        y: bbox.y,
        w: bbox.width,
        h: bbox.height
      });

      // If it is a slide header/title (Y < 150) and indicates Cuti
      if (bbox.y < 150 && label.toLowerCase().includes("cuti")) {
        cutiSlideIds.add(slideId);
      }
    }

    const dayHeaders: DayHeader[] = [];
    const eventBlocks: EventBlock[] = [];
    let cutiBlockText = "";

    // Classify elements using slide context
    for (const elem of rawElements) {
      const labelLower = elem.label.toLowerCase();

      if (elem.y < 150) {
        const lines = elem.label.split("\n").map(l => l.trim()).filter(Boolean);
        if (
          lines.length >= 2 &&
          dayNames.some(day => lines[0]?.toLowerCase().includes(day)) &&
          monthNames.some(mon => labelLower.includes(mon))
        ) {
          dayHeaders.push({
            x: elem.x,
            y: elem.y,
            text: elem.label,
            dayName: lines[0] || "",
            dateText: lines[1] || "",
            date: parseIndonesianDate(lines[0] || "", lines[1] || ""),
            slideId: elem.slideId
          });
        }
      } else {
        // Content Area (Y >= 150)
        // If it's on a cuti slide and contains a colon, it's the leave list block
        if (cutiSlideIds.has(elem.slideId) && elem.label.includes(":")) {
          cutiBlockText = elem.label;
        } else if (
          dayNames.some(day => labelLower.includes(day)) &&
          monthNames.some(mon => labelLower.includes(mon))
        ) {
          // Skip header clones
        } else if (
          labelLower.includes("jadwal kegiatan") ||
          elem.label.length < 5
        ) {
          continue;
        } else if (
          labelLower.includes("rapat") ||
          labelLower.includes("kegiatan") ||
          labelLower.includes("pertemuan") ||
          labelLower.includes("diskusi") ||
          labelLower.includes("undangan") ||
          labelLower.includes("pkl")
        ) {
          eventBlocks.push({ x: elem.x, y: elem.y, text: elem.label, slideId: elem.slideId });
        }
      }
    }

    console.log(`[Slides Scraper] Parsed ${dayHeaders.length} day headers and ${eventBlocks.length} event blocks.`);

    const agendaEventsToInsert: any[] = [];
    
    for (const eb of eventBlocks) {
      const slideHeaders = dayHeaders.filter(h => h.slideId === eb.slideId);
      if (slideHeaders.length === 0) continue;

      const closestDay = slideHeaders.reduce((prev, curr) => {
        return Math.abs(curr.x - eb.x) < Math.abs(prev.x - eb.x) ? curr : prev;
      });

      const individualEvents = eb.text.split(/\n\n+/).map(e => e.trim()).filter(Boolean);

      for (const eventStr of individualEvents) {
        const lines = eventStr.split("\n").map(l => l.trim()).filter(Boolean);
        if (lines.length === 0) continue;

        const title = lines[0] || "Kegiatan";
        const timeLineIndex = lines.findIndex(l => /pkl|pkl\.|s\.d\.|sd|\d{2}[:.]\d{2}/i.test(l));
        const timeText = timeLineIndex !== -1 ? lines[timeLineIndex] || "" : "";

        let locationLines: string[] = [];
        if (timeLineIndex !== -1) {
          locationLines = lines.slice(timeLineIndex + 1);
        } else {
          locationLines = lines.slice(1);
        }
        const location = locationLines.join(", ") || "R. Rapat";

        agendaEventsToInsert.push({
          title,
          timeText,
          location,
          dateText: `${closestDay.dayName}, ${closestDay.dateText}`,
          date: closestDay.date
        });
      }
    }

    const cutiListToInsert: any[] = [];
    if (cutiBlockText) {
      const cutiLines = cutiBlockText.split("\n").map(l => l.trim()).filter(Boolean);
      for (const line of cutiLines) {
        if (line.includes(":") && !line.toLowerCase().includes("daftar cuti")) {
          const parts = line.split(":");
          const employeeName = (parts[0] || "").trim();
          const dateRange = (parts[1] || "").trim();
          if (employeeName && dateRange) {
            cutiListToInsert.push({
              employeeName,
              dateRange,
              monthText: "Juli 2026"
            });
          }
        }
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.agendaEvent.deleteMany();
      await tx.employeeLeave.deleteMany();

      if (agendaEventsToInsert.length > 0) {
        await tx.agendaEvent.createMany({ data: agendaEventsToInsert });
      }

      if (cutiListToInsert.length > 0) {
        await tx.employeeLeave.createMany({ data: cutiListToInsert });
      }

      await tx.systemSetting.upsert({
        where: { key: "agenda_last_sync_time" },
        update: { value: new Date().toISOString() },
        create: { key: "agenda_last_sync_time", value: new Date().toISOString() }
      });

      await tx.systemSetting.upsert({
        where: { key: "agenda_last_sync_status" },
        update: { value: "success" },
        create: { key: "agenda_last_sync_status", value: "success" }
      });
    });

    console.log(`[Slides Scraper] Sync completed successfully! Saved ${agendaEventsToInsert.length} agenda events and ${cutiListToInsert.length} leave entries.`);
    return {
      success: true,
      message: `Scrape success. Saved ${agendaEventsToInsert.length} events and ${cutiListToInsert.length} leaves.`
    };
  } catch (error: any) {
    console.error("[Slides Scraper] Sync failed with error:", error);
    
    try {
      await prisma.systemSetting.upsert({
        where: { key: "agenda_last_sync_status" },
        update: { value: `failed: ${error.message}` },
        create: { key: "agenda_last_sync_status", value: `failed: ${error.message}` }
      });
    } catch (e) {}

    return {
      success: false,
      message: `Scrape failed: ${error.message}`
    };
  } finally {
    isSyncing = false;
  }
}
