const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser to analyze network requests...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  // Speed up by blocking images and fonts
  await page.setRequestInterception(true);
  page.on('request', (req) => {
      if(['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())){
          req.abort();
      }
      else {
          req.continue();
      }
  });

  page.on('response', async response => {
    const url = response.url();
    if (url.includes('api') && ['xhr', 'fetch'].includes(response.request().resourceType())) {
        console.log(`\n[FOUND API] ${response.request().method()} ${url}`);
        try {
            const json = await response.json();
            console.log(`[DATA PREVIEW]: ${JSON.stringify(json).substring(0, 150)}...`);
        } catch(e) {}
    }
  });

  console.log('Navigating to myscheme.gov.in/search...');
  try {
      await page.goto('https://www.myscheme.gov.in/search', { waitUntil: 'domcontentloaded', timeout: 60000 });
      // Wait a bit for client side fetch
      await new Promise(resolve => setTimeout(resolve, 5000));
  } catch (e) {
      console.error(e);
  }
  
  console.log('Finished analyzing network.');
  await browser.close();
})();
