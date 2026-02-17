AI-Powered Student Assistant

MERN Stack + Gemini AI Integration

Overview

This project is a MERN-based web application that allows users to input text or questions, select a task mode, and receive an AI-generated response. It demonstrates backend AI integration, structured prompt engineering, and clean service-layer architecture.

Features

Multiple task modes:

Explain concepts

Generate MCQs

Summarize text

Improve writing

Structured prompts with guardrails

Loading states and error handling

REST API integration

Separation of concerns (routes → controllers → services)

Tech Stack

Frontend: React (Vite)
Backend: Node.js, Express
AI Service: Google Gemini API

Project Structure
client/
  src/
    components/
    pages/
    services/

server/
  routes/
  controllers/
  services/
    ai.service.js
  server.js

Setup Instructions
Backend
cd server
npm install
cp .env.example .env


Update .env:

PORT=5000
AI_API_KEY=your_api_key_here
JWT_SECRET=your_long_random_secret
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/ai-student-assistant?retryWrites=true&w=majority


Start server:

npm run dev


Backend runs at: http://localhost:5000

Frontend
cd client
npm install
npm run dev


Frontend runs at: http://localhost:5173

API Endpoints
POST /api/ai/generate

Request:

{
  "prompt": "Explain JavaScript closures",
  "mode": "explain"
}


Response:

{
  "success": true,
  "data": {
    "mode": "explain",
    "response": "..."
  }
}

GET /api/ai/modes

Returns available task modes.

Prompt Engineering Approach

User input is wrapped in structured prompts before being sent to the AI model. Each prompt includes:

Role definition

Context specification

Explicit rules and constraints

Output format instructions

Guardrails to reduce hallucination

Different task modes use tailored prompt templates to ensure consistent and relevant responses.

Environment Variables
AI_API_KEY=your_api_key_here
JWT_SECRET=your_long_random_secret
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/ai-student-assistant?retryWrites=true&w=majority
PORT=5000


Do not commit real API keys. Use .env.example as a template.

Deployment

Backend: Render (or any Node.js host)

Frontend: Vercel

Set AI_API_KEY, JWT_SECRET, and MONGODB_URI on the backend host

Assignment Checklist

MERN-based full-stack application

AI integration via service layer

Structured prompt engineering

Input validation and error handling

Multiple task modes

Clean project architecture

Author

Om Maurya
B.Tech CSE, KNIT Sultanpur