const MONTH_MAP: Record<string, number> = {
  januari: 0, jan: 0,
  februari: 1, feb: 1,
  maret: 2, mar: 2,
  april: 3, apr: 3,
  mei: 4,
  juni: 5, jun: 5,
  juli: 6, jul: 6,
  agustus: 7, agu: 7, agt: 7,
  september: 8, sep: 8,
  oktober: 9, okt: 9,
  november: 10, nov: 10,
  desember: 11, des: 11
};

/**
 * Parses the end date of an Indonesian leave date range string.
 * Supporting formats:
 * - "29 Juni s.d. 9 Juli 2026"
 * - "30 Juni s.d. 2 Juli 2026"
 * - "1 Juli 2026"
 * - "2 s.d. 3 Juli 2026"
 * - "2 s.d. 6 Juli 2026"
 * - "6 Juli 2026"
 */
export function parseEndLeaveDate(dateRangeStr: string, monthText?: string): Date | null {
  if (!dateRangeStr) return null;

  const cleanStr = dateRangeStr.toLowerCase().trim();

  // Get the end date segment
  let endPart = cleanStr;
  if (cleanStr.includes("s.d.")) {
    const parts = cleanStr.split("s.d.");
    endPart = parts[parts.length - 1].trim();
  } else if (cleanStr.includes("sampai")) {
    const parts = cleanStr.split("sampai");
    endPart = parts[parts.length - 1].trim();
  } else if (cleanStr.includes("-")) {
    const parts = cleanStr.split("-");
    endPart = parts[parts.length - 1].trim();
  }

  // Extract day (first number in the endPart)
  const dayMatch = endPart.match(/\b\d{1,2}\b/);
  if (!dayMatch) return null;
  const day = parseInt(dayMatch[0], 10);

  // Extract month
  let month = -1;
  for (const [mName, mIdx] of Object.entries(MONTH_MAP)) {
    if (endPart.includes(mName)) {
      month = mIdx;
      break;
    }
  }

  // Extract year
  const yearMatch = endPart.match(/\b\d{4}\b/);
  let year = yearMatch ? parseInt(yearMatch[0], 10) : null;

  // Fallbacks if month or year are not in the endPart (use monthText)
  if (month === -1 && monthText) {
    const cleanMonthText = monthText.toLowerCase();
    for (const [mName, mIdx] of Object.entries(MONTH_MAP)) {
      if (cleanMonthText.includes(mName)) {
        month = mIdx;
        break;
      }
    }
  }

  if (!year && monthText) {
    const yearMatchMonth = monthText.match(/\b\d{4}\b/);
    if (yearMatchMonth) {
      year = parseInt(yearMatchMonth[0], 10);
    }
  }

  // Defaults if still missing
  if (month === -1) month = new Date().getMonth();
  if (!year) year = new Date().getFullYear();

  // Set to 23:59:59.999 of the end day so it remains active until the day finishes
  return new Date(year, month, day, 23, 59, 59, 999);
}

interface EmployeeLeaveInput {
  id?: string;
  employeeName: string;
  dateRange: string;
  monthText: string;
}

/**
 * Filters out employee leaves that have already passed relative to the reference date (defaulting to now in Jakarta timezone).
 */
export function filterPassedLeaves<T extends EmployeeLeaveInput>(
  leaves: T[],
  referenceDate?: Date,
  timezone = "Asia/Jakarta"
): T[] {
  // If no referenceDate is provided, calculate the current date/time in the target timezone
  let todayRef = referenceDate;
  if (!todayRef) {
    try {
      todayRef = new Date(new Date().toLocaleString("en-US", { timeZone: timezone }));
    } catch (e) {
      todayRef = new Date();
    }
  }

  return leaves.filter((leave) => {
    const endLeaveDate = parseEndLeaveDate(leave.dateRange, leave.monthText);
    if (!endLeaveDate) return true; // Keep it if we fail to parse, to be safe

    // Leave is passed if the end date is strictly before the reference date/time
    return endLeaveDate >= todayRef!;
  });
}
