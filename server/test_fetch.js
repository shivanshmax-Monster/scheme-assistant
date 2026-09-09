const fs = require('fs');
async function fetchSchemes() {
    try {
        const response = await fetch('https://www.myscheme.gov.in/search');
        const text = await response.text();
        const match = text.match(/<script id="__NEXT_DATA__" type="application\/json">(.+?)<\/script>/);
        if (match) {
            const nextData = JSON.parse(match[1]);
            fs.writeFileSync('next_data.json', JSON.stringify(nextData, null, 2));
            console.log('Successfully extracted Next.js data to next_data.json');
        } else {
            console.log('Could not find __NEXT_DATA__');
        }
    } catch (e) {
        console.error(e);
    }
}
fetchSchemes();
