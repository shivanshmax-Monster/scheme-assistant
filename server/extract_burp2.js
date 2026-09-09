const fs = require('fs');
const content = fs.readFileSync('../../burpe file web data', 'utf-8');
const match = content.match(/\{"status":"Success".*?"data":\{.*?"schemes":\[.*?\]\}\}\}/s);
if (match) {
    const raw = match[0];
    console.log("Found JSON in Burp file! Length:", raw.length);
    try {
        const json = JSON.parse(raw);
        console.log("Parsed schemes count:", json.data.schemes.length);
        const formattedSchemes = json.data.schemes.map(scheme => {
            let description = scheme.basicDetails || scheme.schemeShortTitle || scheme.schemeName || "";
            description = description.replace(/<[^>]*>?/gm, ''); 
            
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
        console.log('Saved data to data.json!');
    } catch(e) {
        console.error("Parse failed:", e);
    }
} else {
    console.log("JSON structure not found.");
}

