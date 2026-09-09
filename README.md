# 🇮🇳 Scheme Assistant (SchemeBot)

Scheme Assistant is an intelligent, conversational web application designed to help citizens in India effortlessly discover government schemes, scholarships, and financial assistance programs. By asking a few simple demographic questions, the AI chatbot filters and fetches relevant schemes directly from the official `myscheme.gov.in` database.

---

## ✨ Features

- **Conversational UI**: A sleek, modern chat interface for easy interaction.
- **Smart Filtering**: Asks personalized questions (Age, Gender, Category, State, Residence, Marital Status) to ensure highly accurate scheme recommendations.
- **Real-Time Data Integration**: Directly queries the `myscheme.gov.in` API to fetch up-to-date and authentic government schemes.
- **Beautiful Results**: Presents discovered schemes in clean, interactive cards highlighting benefits, departments, and direct links to apply.
- **Bilingual Foundation**: Built-in support structure for English and Hindi language toggling.

---

## 🛠️ Tech Stack

### Frontend
- **React 19**
- **Vite** for incredibly fast development and builds.
- **Framer Motion** for smooth, modern UI animations.
- **Lucide React** for beautiful iconography.
- **React Markdown** to safely render formatted text in chat.

### Backend
- **Node.js**
- **Express.js** to handle API routing and manage conversational state.
- **CORS & node-fetch** for secure cross-origin requests to government APIs.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shivanshmax-Monster/scheme-assistant.git
   cd scheme-assistant
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   cd ..
   ```

### Running the Application

You will need two terminal windows to run both the frontend and the backend concurrently.

**1. Start the Backend Server**
Open a terminal, navigate to the `server` directory, and start the Express server:
```bash
cd server
node index.js
```
*The backend will run on `http://localhost:3000`.*

**2. Start the Frontend Development Server**
Open a second terminal, navigate to the root directory, and start Vite:
```bash
npm run dev
```
*The frontend will typically run on `http://localhost:5173`. Open this URL in your browser to start chatting!*

---

## 📁 Project Structure

```text
scheme-assistant/
├── public/                # Static assets (favicons, icons)
├── server/                # Node.js backend
│   ├── index.js           # Main Express server and API logic
│   └── package.json       # Backend dependencies
├── src/                   # React frontend
│   ├── assets/            # Images and SVGs
│   ├── components/        # Reusable UI components (ChatInterface, SchemeCard, etc.)
│   ├── services/          # Services for API handling/mocking
│   ├── App.jsx            # Main Application component
│   ├── App.css            # Global application styles
│   └── main.jsx           # React DOM entry point
├── index.html             # Vite entry HTML
├── package.json           # Frontend dependencies and scripts
└── vite.config.js         # Vite configuration
```

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License
This project is open-source and available under the [ISC License](LICENSE).
