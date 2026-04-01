import puppeteer from "puppeteer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let isScraping = false;

interface BookingData {
  tanggal?: string;
  waktu?: string;
  peminjam?: string;
  institusi?: string;
  pengaturan_ruangan?: string;
  jumlah_peserta?: string;
  kegiatan?: string;
  kegunaan?: string;
  catatan?: string;
  ruangan?: string;
  cIdx?: number;
  _raw?: string;
}

export async function scrapeMeetings() {
  if (isScraping) {
    console.log("[Scraper] Already running, skipping...");
    return;
  }
  
  isScraping = true;
  console.log("[Scraper] Starting Puppeteer scrape for sarpras-ppkasn...");
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });

    const page = await browser.newPage();
    page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
    
    // Set explicit timezone so date parsing in the client app resolves to the correct WIB dates
    try {
      await page.emulateTimezone('Asia/Jakarta');
    } catch(e) {}
    
    console.log("[Scraper] Navigating to https://sarpras-ppkasn.vercel.app/room");
    
    page.on("response", async (response) => {
      const type = response.request().resourceType();
      if (type === "fetch" || type === "xhr") {
        try {
          const text = await response.text();
          if (text.includes("Kegiatan") || text.includes("Peminjam") || text.includes("institusi") || text.includes("tanggal")) {
            console.log(`[Scraper] MATCHED JSON PAYLOAD from URL: ${response.url()}`);
            console.log(`[Scraper] Payload Preview: ${text.substring(0, 500)}`);
          }
        } catch (e) {}
      }
    });

    await page.goto("https://sarpras-ppkasn.vercel.app/room", {
      waitUntil: "networkidle2",
      timeout: 60000,
    }).catch(e => console.log("[Scraper] Navigation warning:", e.message));

    console.log("[Scraper] Waiting for table...");
    await page.waitForSelector("table", { timeout: 15000 }).catch(() => {});
    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log("[Scraper] Finding booking cells...");
    
    // Fallback: If no API intercept, use DOM scraping
    const bookingCells = await page.evaluate(() => {
      const cells: {rowText: string, cellText: string, rIdx: number, cIdx: number}[] = [];
      const tbody = document.querySelector("table tbody");
      if (!tbody) return cells;
      
      const rows = tbody.querySelectorAll("tr");
      rows.forEach((row, rowIdx) => {
        // Kolom 1: No, Kolom 2: Nama Ruangan, Kolom 3: Lantai
        const rowLabel = row.querySelector("td:nth-child(2)")?.textContent?.trim() || `Row ${rowIdx}`;
        
        const tds = row.querySelectorAll("td");
        tds.forEach((cell, cellIdx) => {
          if (cellIdx < 3) return; // Skip the metadata columns (No, Ruangan, Lantai)
          
          const text = cell.textContent?.trim() || "";
          
          // Sel yang memiliki booking ditandai dengan angka (biasanya "1" di screenshot)
          if (text && text !== "" && text !== "-" && /^\d+$/.test(text)) {
            cells.push({ 
              rowText: rowLabel, 
              cellText: text,
              rIdx: rowIdx,
              cIdx: cellIdx
            });
          }
        });
      });
      return cells;
    });

    console.log(`[Scraper] Found ${bookingCells.length} potential booking cells in calendar grid`);

    const allBookings: BookingData[] = [];
    const processedCells = new Set<string>();

    for (let i = 0; i < bookingCells.length; i++) {
      const cell = bookingCells[i];
      if (!cell) continue;
      
      console.log(`[Scraper] Clicking cell ${i + 1}/${bookingCells.length}: "${cell?.cellText}" (row: ${cell?.rowText}, col: ${cell?.cIdx})`);
      
      // Use $eval to click the element using precise coordinates
      await page.$eval('table tbody', (tbody, rIdx, cIdx) => {
        const rows = tbody.querySelectorAll("tr");
        if (rIdx < rows.length) {
          const row = rows[rIdx];
          if (!row) return;
          const tds = row.querySelectorAll("td");
          if (cIdx < tds.length) {
            const td = tds[cIdx];
            if (td) {
              const btn = td.querySelector("button, a, [role='button'], div.cursor-pointer");
              if (btn && btn instanceof HTMLElement) {
                btn.click();
              } else {
                (td as HTMLElement).click();
                td.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
              }
            }
          }
        }
      }, cell.rIdx, cell.cIdx).catch(e => console.log("[Scraper] Click error:", e.message));

      // Wait longer for modal
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      // Extract modal data
      const modalData = await page.evaluate(() => {
        const results: any = {};
        const allText = document.body.innerText;
        
        // We know the modal is open if it has 'Pengaturan Ruangan:' or 'Kegiatan:'
        if (allText.includes('Kegiatan:') || allText.includes('Pengaturan Ruangan:')) {
          const fieldPatterns = [
            { key: 'tanggal', regex: /tanggal[^:\n]*:[\s]*(.+?)(?=\n|$)/i },
            { key: 'waktu', regex: /waktu[^:\n]*:[\s]*(.+?)(?=\n|$)/i },
            { key: 'peminjam', regex: /peminjam[^:\n]*:[\s]*(.+?)(?=\n|$)/i },
            { key: 'institusi', regex: /(?:institusi|unit\s+kerja)[^:\n]*:[\s]*(.+?)(?=\n|$)/i },
            { key: 'pengaturan_ruangan', regex: /pengaturan\s+ruangan[^:\n]*:[\s]*(.+?)(?=\n|$)/i },
            { key: 'jumlah_peserta', regex: /peserta[^:\n]*:[\s]*(\d+)/i },
            { key: 'kegunaan', regex: /(?:kegunaan|kegiatan)[^:\n]*:[\s]*(.+?)(?=\n|$)/i },
            { key: 'catatan', regex: /catatan[^:\n]*:[\s]*(.+?)(?=\n|$)/i },
          ];
          
          for (const p of fieldPatterns) {
            const match = allText.match(p.regex);
            if (match && match[1]) {
              results[p.key] = match[1].trim();
            }
          }
        } else {
          results._raw = allText.substring(0, 500); // save to log why it failed
        }
        
        return results;
      });

      if (Object.keys(modalData).length > 0 && !modalData._raw) {
        modalData.ruangan = cell.rowText;
        modalData.cIdx = cell.cIdx;
        console.log("[Scraper] Found modal data:", JSON.stringify(modalData));
        allBookings.push(modalData);
      } else {
        console.log("[Scraper] No modal data found for cell", cell.cellText);
        if (modalData._raw) console.log("[Scraper] Body text snippet:", modalData._raw.replace(/\n/g, ' '));
      }

      // Close modal by clicking the document or pressing escape
      await page.keyboard.press("Escape").catch(() => {});
      // Also try clicking the generic overlay or close button
      await page.evaluate(() => {
        const modalBg = document.querySelector('[role="dialog"]');
        if (modalBg && modalBg.parentElement) {
            // click outside
            document.body.click();
        }
      }).catch(()=>{});
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log(`[Scraper] Total bookings extracted: ${allBookings.length}`);

    const meetingsToInsert: any[] = [];

    for (const booking of allBookings) {
      let title = booking.kegiatan || booking.kegunaan || "Rapat Koordinasi";
      const institusi = booking.institusi || booking.peminjam;
      
      // Tambahkan informasi instansi / peminjam supaya lebih jelas
      if (institusi && institusi !== "-" && institusi !== "") {
          if (title.toLowerCase().includes("booking") || title.toLowerCase().includes("rapat") || title.toLowerCase().includes("kegiatan")) {
              title = `${title} (${institusi})`;
          } else {
              title = `${title} - ${institusi}`;
          }
      }
      
      const location = booking.ruangan || "Ruang Meeting";
      const attendees = parseInt(booking.jumlah_peserta || "0") || 0;
      
      let startTime = new Date();
      let endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);
      
      if (booking.tanggal) {
        const dateStr = booking.tanggal.toLowerCase();
        const indonesianMonths: Record<string, number> = {
          'januari': 0, 'februari': 1, 'maret': 2, 'april': 3,
          'mei': 4, 'juni': 5, 'juli': 6, 'agustus': 7,
          'september': 8, 'oktober': 9, 'november': 10, 'desember': 11
        };
        
        const dateMatches = [...dateStr.matchAll(/(\d+)\s+(\w+)\s+(\d+)/g)];
        if (dateMatches.length > 0) {
          const m1 = dateMatches[0];
          if (m1) {
            const month1 = indonesianMonths[m1[2] || ""] || 0;
            const year1 = parseInt(m1[3] || "0");
            const day1 = parseInt(m1[1] || "0");
            // Default to 09:00 WIB (02:00 UTC)
            startTime = new Date(Date.UTC(year1, month1, day1, 2, 0));
          
            if (dateMatches.length > 1 && dateMatches[1]) {
              const m2 = dateMatches[1];
              const month2 = indonesianMonths[m2[2] || ""] || 0;
              const year2 = parseInt(m2[3] || "0");
              const day2 = parseInt(m2[1] || "0");
              endTime = new Date(Date.UTC(year2, month2, day2, 10, 0));
            } else {
              endTime = new Date(Date.UTC(year1, month1, day1, 10, 0));
            }
          }
        }
      }
      
      if (booking.waktu) {
        // Handle both colons and dots
        const timeMatch = booking.waktu.match(/(\d{1,2})[:.](\d{2})\s*-\s*(\d{1,2})[:.](\d{2})/);
        if (timeMatch) {
          const startHour = parseInt(timeMatch[1] || "0");
          const startMin = parseInt(timeMatch[2] || "0");
          const endHour = parseInt(timeMatch[3] || "0");
          const endMin = parseInt(timeMatch[4] || "0");
          
          // UTC is local (WIB) - 7 hours
          startTime.setUTCHours(startHour - 7, startMin, 0, 0);
          endTime.setUTCHours(endHour - 7, endMin, 0, 0);
        }
      }
      
      meetingsToInsert.push({
        title: title,
        location: location,
        locationType: "physical",
        startTime,
        endTime,
        status: "confirmed",
        attendees
      });
    }

    const uniqueMeetings: any[] = [];
    const meetingSet = new Set<string>();
    
    for (const m of meetingsToInsert) {
      const key = `${m.title}-${m.location}-${m.startTime.getTime()}-${m.endTime.getTime()}`;
      if (!meetingSet.has(key)) {
        meetingSet.add(key);
        uniqueMeetings.push(m);
      }
    }

    if (uniqueMeetings.length > 0) {
      console.log(`[Scraper] Inserting ${uniqueMeetings.length} unique meetings (from ${meetingsToInsert.length} total extracted)...`);
      
      const today = new Date();
      const startOfMonth = new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1, 0, 0, 0));
      const endOfMonth = new Date(Date.UTC(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59));
      
      await prisma.meeting.deleteMany({
        where: {
          startTime: { gte: startOfMonth, lte: endOfMonth }
        }
      });
      
      for (const m of uniqueMeetings) {
        await prisma.meeting.create({ data: m });
      }
      console.log("[Scraper] Successfully saved meetings.");
    } else {
      console.log("[Scraper] No unique meetings found from clicks.");
    }

  } catch (error) {
    console.error("[Scraper] Error:", error);
  } finally {
    if (browser) await browser.close();
    isScraping = false;
    console.log("[Scraper] Scraping completed, lock released");
  }
}