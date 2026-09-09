# How We Used IBM Bob in SchemeBot

## Overview

For the SkillUp Hackathon, we utilized **IBM Bob** as our primary AI development assistant and pair-programming partner to build **SchemeBot** from the ground up. Rather than just using it as an integration, IBM Bob was instrumental across our entire software development lifecycle, acting as a force multiplier for our team and allowing us to rapidly prototype, debug, and deploy a fully functional application.

## Key Development Activities & Workflows

### 1. Project Architecture and Scaffolding
We used IBM Bob to architect the initial project structure. By interacting with Bob, we rapidly generated the boilerplate for a modern, responsive frontend using React (Vite) and a robust backend using Node.js and Express. Bob helped us set up the initial routing, CORS configurations, and component tree, saving us hours of initial setup time.

### 2. Complex Logic Implementation (State Machine)
One of the core features of SchemeBot is its conversational flow—if a user says "Find me a scholarship", the bot must ask follow-up questions step-by-step (Gender, Age, State, Category, etc.). We prompted IBM Bob to design and write the backend state-machine logic that tracks a user's progress through the questionnaire, stores their answers in a session state, and seamlessly transitions to the next required question.

### 3. API Integration and Data Extraction
Integrating with the live `myscheme.gov.in` government database posed significant challenges due to complex web protections and undocumented endpoints. We used IBM Bob to analyze intercepted network traffic (Burp Suite data) and write custom Node.js extraction scripts. Bob successfully identified the hidden API endpoints and `X-Api-Key` headers, and then wrote the `fetch` logic required to securely query the live government database from our backend.

### 4. Rapid Debugging and Refactoring
Throughout the intense timeline of the hackathon, IBM Bob was our first line of defense against bugs. Whenever we encountered React state synchronization issues, CSS styling conflicts, or backend parsing errors, we provided the error logs to IBM Bob. Bob consistently diagnosed the root causes and provided precise, drop-in code fixes, drastically reducing our downtime.

## Conclusion

Building a live-integrated, conversational AI platform within a hackathon timeframe is incredibly demanding. By leveraging **IBM Bob** as our AI coding assistant, we were able to overcome complex technical hurdles, write cleaner code, and deliver a polished, end-to-end solution on time.
