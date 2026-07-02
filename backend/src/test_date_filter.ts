import { parseEndLeaveDate, filterPassedLeaves } from "./utils/dateFilter";

const testCases = [
  { range: "29 Juni s.d. 9 Juli 2026", month: "Juli 2026", expectedEnd: new Date(2026, 6, 9, 23, 59, 59, 999) },
  { range: "30 Juni s.d. 2 Juli 2026", month: "Juli 2026", expectedEnd: new Date(2026, 6, 2, 23, 59, 59, 999) },
  { range: "1 Juli 2026", month: "Juli 2026", expectedEnd: new Date(2026, 6, 1, 23, 59, 59, 999) },
  { range: "2 Juli 2026", month: "Juli 2026", expectedEnd: new Date(2026, 6, 2, 23, 59, 59, 999) },
  { range: "2 s.d. 3 Juli 2026", month: "Juli 2026", expectedEnd: new Date(2026, 6, 3, 23, 59, 59, 999) },
  { range: "2 s.d. 6 Juli 2026", month: "Juli 2026", expectedEnd: new Date(2026, 6, 6, 23, 59, 59, 999) },
  { range: "6 Juli 2026", month: "Juli 2026", expectedEnd: new Date(2026, 6, 6, 23, 59, 59, 999) },
];

function runTests() {
  console.log("=== RUNNING DATE RANGE PARSING TESTS ===");
  let failed = 0;

  for (const tc of testCases) {
    let result: Date | null = null;
    try {
      result = parseEndLeaveDate(tc.range, tc.month);
    } catch (e: any) {
      console.error(`ERROR running parser on: ${tc.range}`, e);
    }
    const resultTime = result ? result.getTime() : null;
    const expectedTime = tc.expectedEnd.getTime();
    
    if (resultTime !== expectedTime) {
      console.error(`FAIL: parseEndLeaveDate("${tc.range}", "${tc.month}")`);
      console.error(`  Expected: ${tc.expectedEnd.toISOString()} (local: ${tc.expectedEnd.toLocaleString()})`);
      console.error(`  Got:      ${result ? result.toISOString() : "null"} (local: ${result ? result.toLocaleString() : "null"})`);
      failed++;
    } else {
      console.log(`PASS: parseEndLeaveDate("${tc.range}") -> ${result?.toLocaleString()}`);
    }
  }

  console.log("\n=== RUNNING FILTERING TESTS (Assuming today is July 2nd, 2026) ===");
  const leaves = [
    { id: "1", employeeName: "Lisa Mariska", dateRange: "29 Juni s.d. 9 Juli 2026", monthText: "Juli 2026" },
    { id: "2", employeeName: "Eva Mahardhika", dateRange: "30 Juni s.d. 2 Juli 2026", monthText: "Juli 2026" },
    { id: "3", employeeName: "Ulfina Yusman", dateRange: "1 Juli 2026", monthText: "Juli 2026" },
    { id: "4", employeeName: "Soehendra", dateRange: "2 Juli 2026", monthText: "Juli 2026" },
    { id: "5", employeeName: "Danang Mukhtar Hafid", dateRange: "2 s.d. 3 Juli 2026", monthText: "Juli 2026" },
    { id: "6", employeeName: "Ratna Nurwitasari", dateRange: "2 s.d. 6 Juli 2026", monthText: "Juli 2026" },
    { id: "7", employeeName: "Djoko Suntoro", dateRange: "6 Juli 2026", monthText: "Juli 2026" },
  ];

  // Simulated current time: July 2nd, 2026, 09:00:00 local time
  const simToday = new Date(2026, 6, 2, 9, 0, 0);
  let filtered: any[] = [];
  try {
    filtered = filterPassedLeaves(leaves, simToday);
  } catch (e: any) {
    console.error("ERROR running filterPassedLeaves", e);
    failed++;
  }
  
  const filteredNames = filtered.map(l => l.employeeName);
  console.log("Filtered leaves names:", filteredNames);
  
  if (filteredNames.includes("Ulfina Yusman")) {
    console.error("FAIL: 'Ulfina Yusman' (1 Juli 2026) should be filtered out on July 2nd, 2026.");
    failed++;
  } else {
    console.log("PASS: 'Ulfina Yusman' successfully filtered out.");
  }

  const expectedNames = [
    "Lisa Mariska",
    "Eva Mahardhika",
    "Soehendra",
    "Danang Mukhtar Hafid",
    "Ratna Nurwitasari",
    "Djoko Suntoro"
  ];

  for (const name of expectedNames) {
    if (!filteredNames.includes(name)) {
      console.error(`FAIL: '${name}' should not be filtered out on July 2nd, 2026.`);
      failed++;
    } else {
      console.log(`PASS: '${name}' correctly retained.`);
    }
  }

  if (failed > 0) {
    console.error(`\nTest completed with ${failed} failures.`);
    process.exit(1);
  } else {
    console.log("\nAll tests passed successfully!");
    process.exit(0);
  }
}

runTests();
