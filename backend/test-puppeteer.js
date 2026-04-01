const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: "new"});
  const page = await browser.newPage();
  
  const responses = [];
  page.on('response', async (response) => {
    const url = response.url();
    const type = response.request().resourceType();
    
    if (url.includes('.json') || url.includes('/api/') || type === 'fetch' || type === 'xhr') {
      try {
        const text = await response.text();
        if (text.includes('booking') || text.includes('room') || text.includes('prima')) {
          responses.push({url, type});
        }
      } catch(e) {}
    }
  });

  console.log('Navigating...');
  await page.goto('https://sarpras-ppkasn.vercel.app/room', {waitUntil: 'networkidle0'});
  console.log('Finished loading, waiting 3s for any delayed data...');
  await new Promise(r => setTimeout(r, 3000));
  console.log(JSON.stringify(responses, null, 2));
  await browser.close();
})();
