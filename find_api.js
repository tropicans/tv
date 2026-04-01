const fs = require('fs');

async function run() {
  const res = await fetch('https://sarpras-ppkasn.vercel.app/room');
  const html = await res.text();
  
  const scriptRegex = /src="(\/_next\/static\/chunks\/[a-zA-Z0-9.-]+\.js)"/g;
  let match;
  const urls = [];
  while ((match = scriptRegex.exec(html)) !== null) {
    urls.push(`https://sarpras-ppkasn.vercel.app${match[1]}`);
  }

  console.log(`Found ${urls.length} scripts to analyze.`);

  const apiRegex = /https:\/\/[a-zA-Z0-9.-]+\/(?:api|room|schedule|booking)/g;
  let matches = new Set();
  
  for (const url of urls) {
    try {
      const scriptRes = await fetch(url);
      const scriptBody = await scriptRes.text();
      
      const found = scriptBody.match(apiRegex);
      if (found) {
        found.forEach(url => matches.add(url));
      }

      // Also let's check for any fetch calls
      const fetchRegex = /fetch\((?:'|")([^'"]+)(?:'|")/g;
      let fm;
      while ((fm = fetchRegex.exec(scriptBody)) !== null) {
          matches.add('fetch: ' + fm[1]);
      }
    } catch (e) {
      console.log('Error fetching', url);
    }
  }

  console.log('Results:');
  console.log([...matches]);
}

run();
