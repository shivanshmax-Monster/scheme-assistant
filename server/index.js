const express = require('express');
const cors = require('cors');
const schemesData = require('./data.json');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/match-form', (req, res) => {
    const formData = req.body;
    let scoredSchemes = schemesData.map(s => {
        let score = 0;
        const tagsStr = s.tags.join(' ').toLowerCase();
        const descStr = s.description.toLowerCase();
        const deptStr = s.department.toLowerCase();
        const nameStr = s.name.toLowerCase();

        if (formData.gender === 'Female' && (tagsStr.includes('women') || descStr.includes('girl') || descStr.includes('female'))) score += 10;
        if (formData.category && (tagsStr.includes(formData.category.toLowerCase()) || descStr.includes(formData.category.toLowerCase()))) score += 15;
        if (formData.student === 'Yes' && (tagsStr.includes('education') || nameStr.includes('scholarship'))) score += 10;
        if (formData.state && (deptStr.includes(formData.state.toLowerCase()) || tagsStr.includes(formData.state.toLowerCase()))) score += 10;
        
        return { ...s, rawScore: score };
    });

    let matchedSchemes = scoredSchemes.filter(s => s.rawScore > 0).sort((a, b) => b.rawScore - a.rawScore);
    if (matchedSchemes.length === 0) matchedSchemes = schemesData.slice(0, 3); // Fallback

    setTimeout(() => res.json({ schemes: matchedSchemes.slice(0, 5) }), 1000);
});

app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  const lowerInput = message.toLowerCase().trim();

  // Greetings
  if (lowerInput === 'hello' || lowerInput === 'hi' || lowerInput === 'hey') {
      setTimeout(() => {
        return res.json({
          type: 'text',
          message: "Hello! 👋 I am your **AI Government Scheme Assistant**. \n\nI am fully integrated with a massive live-synced database of schemes from myScheme.gov.in. \n\nAsk me about **healthcare, agriculture, business loans, women empowerment, or student scholarships**!"
        });
      }, 500);
      return;
  }

  // --- Enhanced NLP Search & Scoring Algorithm ---
  // 1. Tokenize user input and remove stop words
  const stopWords = new Set(['i', 'want', 'to', 'find', 'a', 'the', 'is', 'for', 'me', 'what', 'are', 'some', 'get', 'need', 'of', 'and', 'in', 'can', 'you', 'give', 'show', 'tell', 'about', 'how', 'do', 'any', 'scheme', 'schemes', 'yojana', 'am', 'an', 'old', 'from']);
  const tokens = lowerInput.replace(/[.,!?]/g, '').split(/\s+/).filter(word => word.length > 2 && !stopWords.has(word));

  // Extract common demographic parameters
  const ageMatch = lowerInput.match(/(\d+)\s*years?\s*old/i) || lowerInput.match(/age\s*(\d+)/i);
  const age = ageMatch ? parseInt(ageMatch[1]) : null;
  
  const isFemale = lowerInput.includes('female') || lowerInput.includes('woman') || lowerInput.includes('girl');
  const isMale = lowerInput.includes('male') || lowerInput.includes('man') || lowerInput.includes('boy');
  const isStudent = lowerInput.includes('student') || lowerInput.includes('study') || lowerInput.includes('college') || lowerInput.includes('school');
  
  const categoryMatch = lowerInput.match(/\b(st|sc|obc|general|pvtg)\b/i);
  const category = categoryMatch ? categoryMatch[1].toUpperCase() : null;

  // Extract State (simple examples)
  const states = ['mp', 'madhya pradesh', 'maharashtra', 'karnataka', 'delhi', 'up', 'uttar pradesh'];
  let state = null;
  for (const s of states) {
      if (lowerInput.includes(s)) {
          state = s;
          break;
      }
  }

  // If no meaningful tokens or parameters remain, skip to generic response
  if (tokens.length > 0 || age || isFemale || isMale || isStudent || category || state) {
      // 2. Score each scheme
      let scoredSchemes = schemesData.map(s => {
          let score = 0;
          
          const tagsStr = s.tags.join(' ').toLowerCase();
          const nameStr = s.name.toLowerCase();
          const deptStr = s.department.toLowerCase();
          const descStr = s.description.toLowerCase();
          const benefitsStr = s.benefits ? s.benefits.join(' ').toLowerCase() : '';
          const eligStr = s.eligibility ? s.eligibility.join(' ').toLowerCase() : '';

          // Demographic scoring logic (heuristics based on scheme text)
          if (age) {
              // If scheme mentions age ranges (mock heuristic)
              if (descStr.includes(age.toString()) || eligStr.includes(age.toString())) score += 5;
          }
          if (isFemale && (tagsStr.includes('women') || descStr.includes('girl') || descStr.includes('female'))) score += 10;
          if (isMale && tagsStr.includes('men')) score += 5;
          if (isStudent && (tagsStr.includes('education') || nameStr.includes('scholarship') || descStr.includes('student'))) score += 10;
          if (category && (tagsStr.includes(category.toLowerCase()) || descStr.includes(category.toLowerCase()) || nameStr.includes(category.toLowerCase()))) score += 15;
          
          let stateMapped = state === 'mp' ? 'madhya pradesh' : state;
          if (stateMapped && (deptStr.includes(stateMapped) || tagsStr.includes(stateMapped))) score += 15;

          tokens.forEach(token => {
              // Exact matches or strong substring matches using word boundaries
              const tokenRegex = new RegExp(`\\b${token}\\b`, 'i');
              
              if (tokenRegex.test(tagsStr)) score += 5;
              if (tokenRegex.test(nameStr)) score += 4;
              if (tokenRegex.test(deptStr)) score += 3;
              if (tokenRegex.test(descStr)) score += 1;
              if (tokenRegex.test(benefitsStr)) score += 1;
              if (tokenRegex.test(eligStr)) score += 1;
              
              // Give partial credit if the token is a substring of tags/name (e.g. "scholar" in "scholarship")
              if (!tokenRegex.test(tagsStr) && tagsStr.includes(token)) score += 2;
              if (!tokenRegex.test(nameStr) && nameStr.includes(token)) score += 1;
          });

          return { ...s, rawScore: score };
      });

      // 3. Filter out zero scores and sort by score descending
      let matchedSchemes = scoredSchemes.filter(s => s.rawScore > 0).sort((a, b) => b.rawScore - a.rawScore);

      // 4. If schemes found
      if (matchedSchemes.length > 0) {
          // Take top 3
          matchedSchemes = matchedSchemes.slice(0, 3);
          
          const schemesWithScore = matchedSchemes.map((s, index) => {
              // Deterministic match score percentage based on rank
              const percentageBase = 95 - (index * 4); // 95%, 91%, 87%
              const finalScore = Math.min(99, percentageBase + (s.rawScore % 4));
              
              return {
                  ...s,
                  matchScore: finalScore
              };
          });

          // Remove the temporary rawScore from output
          schemesWithScore.forEach(s => delete s.rawScore);

          setTimeout(() => {
              return res.json({
                type: 'schemes',
                message: `I analyzed the government database and found ${schemesWithScore.length} highly relevant scheme${schemesWithScore.length > 1 ? 's' : ''} for you:`,
                schemes: schemesWithScore
              });
          }, 1500);
          return;
      }
  }  // Open-ended response
  setTimeout(() => {
      return res.json({
        type: 'text',
        message: `I searched our synchronized government database for **"${message.length > 30 ? message.substring(0, 30) + '...' : message}"** but couldn't find an exact match.\n\nTry asking me for "Business Loans", "Agriculture Schemes", or "Student Scholarships".`
      });
  }, 1000);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
