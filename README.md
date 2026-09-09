# AI Government Scheme Assistant (SchemeBot)

**Team:** CODEX  
**Hackathon:** SkillUp Hackathon in collaboration with IBM SkillsBuild

SchemeBot is an intelligent, conversational AI assistant designed to help citizens easily discover government schemes and scholarships they are eligible for. 

Instead of navigating complex forms or reading through hundreds of pages, users simply chat with the bot. SchemeBot asks intuitive, step-by-step follow-up questions to understand the user's demographic profile, and then fetches real-time results directly from the government database.

---

## 📊 Project Presentation
**A complete overview of our project, problem statement, architecture, and live screenshots can be found in our pitch deck!**

👉 **[Download the SchemeBot Presentation (.pptx)](./SchemeBot_Presentation.pptx)**

*(You can download the PPT directly from the link above or find `SchemeBot_Presentation.pptx` in the root of this repository.)*

---

## ✨ Features

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

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Framer Motion, Lucide Icons.
- **Backend:** Node.js, Express.js.
- **AI Assistant:** IBM Bob (Used as core development partner for NLP logic and architecture).
- **Data Source:** Live API integration with the official MyScheme portal.

---

## 🚀 How to Run Locally

You will need two terminal windows open to run the backend and the frontend simultaneously.

### 1. Start the Backend Server
The backend handles the conversational state machine and forwards queries to the government API.

```bash
# Open your first terminal
cd server
npm install
node index.js
```
*The backend server will now be running on `http://localhost:3000`*

### 2. Start the Frontend App
The frontend is a Vite-powered React application.

```bash
# Open a second terminal in the root directory (scheme-assistant)
npm install
npm run dev
```
*The app will automatically open in your browser (usually `http://localhost:5173`).*

---

## 💬 Usage Example

Once both servers are running, open your browser and interact with the bot!

**User:** "Find me a scholarship"  
**Bot:** "I'd love to help you find schemes/scholarships! To give you accurate results directly from the government database, I need to ask a few quick questions. What is your gender? (Male / Female / Transgender)"  
**User:** "Female"  
**Bot:** "What is your age?"  
...  
*(After all questions are answered, the bot fetches and displays live results from myscheme.gov.in!)*
