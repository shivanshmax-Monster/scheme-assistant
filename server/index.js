const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Simple global state for demo purposes
let sessionState = {
    step: 0,
    searchParams: {}
};

const QUESTIONS = [
    { key: 'gender', text: 'What is your gender? (Male / Female / Transgender)' },
    { key: 'age', text: 'What is your age?' },
    { key: 'maritalStatus', text: 'What is your marital status? (Never Married / Married / Widowed / Divorced)' },
    { key: 'state', text: 'Which State do you live in? (e.g. Madhya Pradesh, Maharashtra, etc.)' },
    { key: 'residence', text: 'Do you live in an Urban or Rural area?' },
    { key: 'category', text: 'What is your category? (General / OBC / PVTG / SC / ST)' }
];

async function fetchFromMySchemeAPI(params) {
    const facets = [];
    
    // Map params closely to the API's requirements (this requires specific casing)
    if (params.gender) {
        if(params.gender.toLowerCase() === 'female') facets.push(`"beneficiaryGender":["Female"]`);
        if(params.gender.toLowerCase() === 'male') facets.push(`"beneficiaryGender":["Male"]`);
    }
    if (params.state) facets.push(`"beneficiaryState":["${params.state}"]`);
    if (params.residence) {
        if (params.residence.toLowerCase().includes('urban')) facets.push(`"residence":["Urban"]`);
        if (params.residence.toLowerCase().includes('rural')) facets.push(`"residence":["Rural"]`);
    }
    if (params.category) {
        const cat = params.category.toUpperCase();
        if (['ST','SC','OBC','GENERAL','PVTG'].includes(cat)) {
             facets.push(`"caste":["${cat}"]`);
        }
    }
    
    // Construct the query
    let q = "[]";
    if (facets.length > 0) {
        q = encodeURIComponent(`[{${facets.join(',')}}]`);
    }

    const url = `https://api.myscheme.gov.in/search/v6/schemes?lang=en&q=${q}&keyword=&sort=&from=0&size=5`;
    console.log("Fetching from API:", url);

    try {
        const response = await fetch(url, {
            headers: {
                'X-Api-Key': 'tYTy5eEhlu9rFjyxuCr7ra7ACp4dv1RH8gWuHTDc',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const data = await response.json();
        
        if (data && data.data && data.data.schemes) {
            return data.data.schemes.map(scheme => {
                let description = scheme.basicDetails || scheme.schemeShortTitle || scheme.schemeName || "";
                description = description.replace(/<[^>]*>?/gm, ''); 
                return {
                    id: scheme.basicDetails?.slug || scheme.schemeName,
                    name: scheme.schemeName,
                    department: scheme.ministryName || scheme.stateName || "Govt of India",
                    description: description.substring(0, 150) + "...",
                    benefits: [
                        scheme.tags && scheme.tags.length > 0 ? scheme.tags[0] : "Financial Assistance"
                    ],
                    eligibility: ["Check official portal for exact details"],
                    tags: [scheme.ministryName || "Gov", ...(scheme.tags || [])].slice(0, 3),
                    url: `https://www.myscheme.gov.in/schemes/${scheme.basicDetails?.slug || ''}`
                };
            });
        }
    } catch (e) {
        console.error("Fetch API error:", e);
    }
    return [];
}

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    const lowerInput = message.toLowerCase().trim();

    // Reset command
    if (lowerInput === 'reset' || lowerInput === 'restart') {
        sessionState = { step: 0, searchParams: {} };
        return res.json({ type: 'text', message: "Session restarted. How can I help you today?" });
    }

    // Step 0: Waiting for the user to trigger scheme search
    if (sessionState.step === 0) {
        if (lowerInput.includes('scheme') || lowerInput.includes('scholarship') || lowerInput.includes('loan')) {
            sessionState.step = 1; 
            return res.json({
                type: 'text',
                message: `I'd love to help you find schemes/scholarships! To give you accurate results directly from the government database, I need to ask a few quick questions.\n\n**${QUESTIONS[0].text}**`
            });
        } else if (lowerInput === 'hello' || lowerInput === 'hi') {
            return res.json({
                type: 'text',
                message: "Hello! 👋 I am your AI Government Scheme Assistant.\n\nAsk me to **find a scholarship** or **search for schemes**!"
            });
        } else {
             return res.json({
                type: 'text',
                message: "I can help you find government schemes and scholarships. Just type **'Find me a scholarship'** to get started!"
            });
        }
    }

    // We are currently asking questions
    if (sessionState.step > 0 && sessionState.step <= QUESTIONS.length) {
        const currentQ = QUESTIONS[sessionState.step - 1];
        
        // Save the answer to the current question
        let answer = message.trim();
        sessionState.searchParams[currentQ.key] = answer;
        
        sessionState.step++;

        if (sessionState.step <= QUESTIONS.length) {
            // Ask next question
            return res.json({
                type: 'text',
                message: `**${QUESTIONS[sessionState.step - 1].text}**`
            });
        } else {
            // All questions answered! Fetch from API
            console.log("Completed Questionnaire. Params:", sessionState.searchParams);
            
            const schemes = await fetchFromMySchemeAPI(sessionState.searchParams);
            sessionState.step = 0; // reset
            
            if (schemes.length > 0) {
                return res.json({
                    type: 'schemes',
                    message: `Thank you! I found **${schemes.length} schemes** matching your profile directly from the government database! Here are the top results:`,
                    schemes: schemes
                });
            } else {
                 return res.json({
                    type: 'text',
                    message: "Thank you! I queried the government database but couldn't find any direct matches. You might want to try again with different parameters or visit myscheme.gov.in."
                });
            }
        }
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
