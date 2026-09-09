const fs = require('fs');
const zlib = require('zlib');

const xmlContent = fs.readFileSync('../../burpe file web data', 'utf-8');
const requestsAndResponses = xmlContent.split('<item>');

let foundData = null;

for (const item of requestsAndResponses) {
    if (item.includes('/search/v6/schemes')) {
        const responseMatch = item.match(/<response base64="(true|false)"><!\[CDATA\[(.*?)\]\]><\/response>/s);
        if (responseMatch) {
            const isBase64 = responseMatch[1] === "true";
            let fullResponse = responseMatch[2];
            
            let buffer;
            if (isBase64) {
                buffer = Buffer.from(fullResponse, 'base64');
            } else {
                buffer = Buffer.from(fullResponse, 'utf-8');
            }
            
            // The buffer contains HTTP headers + \r\n\r\n + body
            const headerEndIndex = buffer.indexOf('\r\n\r\n');
            if (headerEndIndex !== -1) {
                const headersStr = buffer.subarray(0, headerEndIndex).toString('utf-8');
                const rawBody = buffer.subarray(headerEndIndex + 4);
                
                let bodyStr = '';
                if (headersStr.toLowerCase().includes('content-encoding: gzip')) {
                    try {
                        bodyStr = zlib.gunzipSync(rawBody).toString('utf-8');
                    } catch(e) {
                         console.log("gunzip failed");
                         continue;
                    }
                } else if (headersStr.toLowerCase().includes('content-encoding: br')) {
                    try {
                        bodyStr = zlib.brotliDecompressSync(rawBody).toString('utf-8');
                    } catch(e) {
                        console.log("brotli failed");
                        continue;
                    }
                } else if (headersStr.toLowerCase().includes('content-encoding: deflate')) {
                     try {
                        bodyStr = zlib.inflateSync(rawBody).toString('utf-8');
                    } catch(e) {
                        console.log("deflate failed");
                        continue;
                    }
                } else {
                    bodyStr = rawBody.toString('utf-8');
                }

                try {
                    // Try to clean up chunked encoding if any
                    let cleanBody = bodyStr;
                    if (headersStr.toLowerCase().includes('transfer-encoding: chunked')) {
                         // Sometimes burp auto-decodes chunks but not always.
                         // For now, let's just try parsing.
                    }
                    
                    const json = JSON.parse(cleanBody);
                    if (json && json.data && json.data.schemes) {
                        foundData = json.data.schemes;
                        console.log(`Found ${foundData.length} schemes from Burp file!`);
                        break;
                    }
                } catch(e) {
                    console.log("Failed to parse JSON. Body starts with:", bodyStr.substring(0, 50));
                }
            }
        }
    }
}

if (foundData) {
    const formattedSchemes = foundData.map(scheme => {
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
    console.log('Saved data to data.json!');
} else {
    console.log('Could not find schemes data in Burp file.');
}
