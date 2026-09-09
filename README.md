# 🇮🇳 Scheme Assistant (SchemeBot) & API Extractor

Scheme Assistant is a comprehensive project designed to simplify the discovery of Indian government schemes, scholarships, and financial assistance programs. 

At its core, this project **reverse-engineers the official `myscheme.gov.in` portal** to extract its internal APIs and data structure, and then wraps that data in a modern, conversational AI chatbot interface.

---

## 🎯 What is it for?

The official government portals often require users to navigate complex menus and fill out long forms to find schemes. This project was built to:
1. **Bypass the manual search process** by providing a simple, conversational Chatbot (SchemeBot).
2. **Reverse-engineer the government portal** to understand how it fetches data.
3. **Extract raw data and API keys** using web scraping and network traffic analysis.
4. **Provide a seamless frontend** where a user can simply chat to find out what schemes they are eligible for.

---

## ⚙️ What does it do? (Key Components)

This project is divided into three main functional areas:

### 1. Data Extraction & Reverse Engineering (`/server`)
Instead of relying on public datasets, this project extracts the live, hidden APIs used by the official `myscheme.gov.in` website.
- **Burp Suite XML Parser (`extract_burp.js`)**: Parses raw `burpe file web data` (XML exports from Burp Suite proxy). It decompresses gzip/brotli HTTP responses to extract the hidden JSON scheme data that the official portal sends to the browser.
- **Puppeteer Network Interceptor (`scraper.js`)**: Runs a headless browser to navigate to the official portal, intercepts the background API XHR/fetch requests (specifically `/search/v6/schemes`), and saves the raw JSON data to a local `data.json` file.
- **Network Analyzer (`analyze_network.js`)**: Analyzes API payloads and structures.

### 2. Conversational Backend API (`/server/index.js`)
A Node.js Express server that acts as the brain of the chatbot.
- It maintains a multi-step conversation state with the user.
- It asks 6 demographic questions (Gender, Age, Marital Status, State, Residence, Category).
- It formats the user's answers into a complex query and hits the official `api.myscheme.gov.in` API in real-time (using the intercepted API key `X-Api-Key`) to fetch accurate, live results.

### 3. AI Chatbot Frontend (`/src`)
A modern, responsive React + Vite frontend that mimics an AI assistant (powered by "IBM Bob").
- Features a clean Chat Interface (`ChatInterface.jsx`) for back-and-forth conversation.
- Renders the resulting government schemes as beautiful, easy-to-read cards (`SchemeCard.jsx`) with direct links to apply.
- Includes smooth animations using Framer Motion and supports bilingual toggling (English/Hindi).

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.

### Installation

```bash
git clone https://github.com/shivanshmax-Monster/scheme-assistant.git
cd scheme-assistant
```

### Running the Application

You need to run both the backend and frontend simultaneously.

**1. Start the Backend Chat Server**
```bash
cd server
npm install
node index.js
```
*(The backend runs on `http://localhost:3000`)*

**2. Start the Frontend App**
Open a new terminal in the root `scheme-assistant` folder:
```bash
npm install
npm run dev
```
*(The frontend runs on `http://localhost:5173`)*

### Running the Scrapers / Extractors
If you want to update the local `data.json` or test the extraction methods, you can run the scraper scripts individually:
```bash
cd server
node scraper.js
# or
node extract_burp.js
```

---

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite, Framer Motion, Lucide React
- **Backend**: Node.js, Express
- **Scraping / Extraction**: Puppeteer, zlib (for Burp decompression), Cheerio
