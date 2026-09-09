# AI Government Scheme Assistant (SchemeBot)

SchemeBot is an intelligent, conversational AI assistant designed to help citizens easily discover government schemes and scholarships they are eligible for. 

Instead of navigating complex forms or reading through hundreds of pages, users simply chat with the bot. SchemeBot asks intuitive, step-by-step follow-up questions to understand the user's demographic profile, and then fetches real-time results directly from the government database.

## Features

- **Conversational Discovery:** Simply type "Find me a scholarship" or "I need a scheme" to start the flow.
- **Dynamic Questionnaire:** The bot asks for your specific details step-by-step:
  - Gender
  - Age
  - Marital Status
  - State
  - Urban / Rural Residence
  - Category (General, OBC, SC, ST, PVTG)
- **Live Government Data Integration:** Once the profile is built, the backend dynamically queries the official `api.myscheme.gov.in` database to return highly accurate, real-time matching schemes.
- **Modern UI:** Built with a sleek, responsive React Chat interface.

## Tech Stack

- **Frontend:** React, Vite, Framer Motion, Lucide Icons.
- **Backend:** Node.js, Express.js.
- **Data Source:** Live API integration with the official MyScheme portal.

## How to Run Locally

### 1. Start the Backend Server
The backend handles the conversational state machine and forwards queries to the government API.
```bash
cd server
npm install
node index.js
```
*The server will run on http://localhost:3000*

### 2. Start the Frontend
The frontend is a Vite-powered React application.
```bash
# In the root directory (scheme-assistant)
npm install
npm run dev
```
*The app will open in your browser on the local Vite port.*

## Usage Example

**User:** "Find me a scholarship"
**Bot:** "I'd love to help you find schemes/scholarships! To give you accurate results directly from the government database, I need to ask a few quick questions. What is your gender? (Male / Female / Transgender)"
**User:** "Female"
**Bot:** "What is your age?"
... 
*(Bot fetches and displays tailored results from myscheme.gov.in!)*
