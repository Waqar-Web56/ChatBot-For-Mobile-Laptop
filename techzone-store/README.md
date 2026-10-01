# TechZone - Laptop & Mobile Store with Groq AI Chatbot

## Run
1. Install Node.js 18+
2. `npm install`
3. Open `.env` and set `GROQ_API_KEY=your_key` (get one free at https://console.groq.com/keys)
4. `npm start` then open http://localhost:3000

## Structure
- `store-data.js` - products, prices, policies (edit here; site + chatbot update)
- `server.js`     - Express server; `/api/chat` calls Groq with a system prompt
- `public/`       - index.html (Tailwind), style.css, app.js (UI + chat logic)

## How the chatbot works (for students)
1. Browser sends the chat history to `/api/chat`.
2. Server adds a **system prompt** (store data + rules) and calls Groq.
3. Reply is shown in the chat window.
The API key stays on the server in `.env` - never put it in frontend JS.
Scope is restricted by the system prompt: off-topic questions get a polite refusal.
