const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeMySchemeAPI() {
    console.log('Launching headless browser...');
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    // Speed up by blocking images and fonts
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if(['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())){
            req.abort();
        } else {
            req.continue();
        }
    });

    let schemes = [];

    page.on('response', async response => {
        const url = response.url();
        if (url.includes('/search/v6/schemes') && ['xhr', 'fetch'].includes(response.request().resourceType())) {
            try {
                const json = await response.json();
                if (json.data && json.data.schemes) {
                    schemes = json.data.schemes;
                    console.log(`Intercepted API! Found ${schemes.length} schemes.`);
                }
            } catch(e) {
                console.error("Failed to parse intercepted response:", e);
            }
        }
    });

    console.log('Navigating to myscheme.gov.in/search ...');
    
    try {
        await page.goto('https://www.myscheme.gov.in/search', { waitUntil: 'domcontentloaded', timeout: 60000 });
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        if (schemes.length > 0) {
            console.log(`Success! Processing ${schemes.length} schemes...`);
            
            const formattedSchemes = schemes.map(scheme => {
                let description = scheme.basicDetails || scheme.schemeShortTitle || scheme.schemeName || "";
                description = description.replace(/<[^>]*>?/gm, ''); // Remove HTML
                
                return {
                    id: scheme.basicDetails?.slug || scheme.schemeName,
                    name: scheme.schemeName,
                    department: scheme.ministryName || scheme.stateName || "Govt of India",
                    description: description.substring(0, 150) + "...",
                    benefits: [
                        scheme.tags && scheme.tags.length > 0 ? scheme.tags[0] : "Financial Assistance",
                        "Government Supported"
                    ],
                    eligibility: ["Check official portal for exact details"],
                    tags: [scheme.ministryName || "Gov", ...(scheme.tags || [])].slice(0, 3),
                    url: `https://www.myscheme.gov.in/schemes/${scheme.basicDetails?.slug || ''}`
                };
            });

            fs.writeFileSync('./data.json', JSON.stringify(formattedSchemes, null, 2));
            console.log('Saved clean data to data.json!');
        } else {
             console.error("Failed to intercept schemes API call.");
        }

    } catch (error) {
        console.error("Scrape failed.");
        console.error(error);
    } finally {
        await browser.close();
    }
}

scrapeMySchemeAPI();
