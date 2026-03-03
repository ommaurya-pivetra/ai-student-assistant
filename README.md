# AI-Powered Student Assistant

![MERN](https://img.shields.io/badge/MERN-Stack-000000?style=for-the-badge)
![AI](https://img.shields.io/badge/Gemini-AI-000000?style=for-the-badge)
![Full Stack](https://img.shields.io/badge/Full--Stack-Project-000000?style=for-the-badge)

## 📌 Overview

AI-Powered Student Assistant is a full-stack MERN web application that allows users to input text or questions, choose a task mode, and receive AI-generated responses in real time.

The project demonstrates production-ready backend architecture, structured prompt engineering, secure API integration, and clean separation of concerns.

---

## 🌐 Live Demo

**Frontend:** https://ai-student-assistant-ten.vercel.app  
**Backend API:** https://ai-student-assistant-l095.onrender.com  

---

## ✨ Key Features

- Multiple AI task modes:
  - Concept explanation
  - MCQ generation
  - Text summarization
  - Writing improvement
- Structured prompts with guardrails
- Real-time AI responses
- JWT-based authentication
- Chat history storage
- Loading states & error handling
- Clean layered architecture  
  *(Routes → Controllers → Services)*
- Responsive user interface

---

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/React-000000?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-000000?style=for-the-badge&logo=vite)
![JavaScript](https://img.shields.io/badge/JavaScript-000000?style=for-the-badge&logo=javascript)
![Node.js](https://img.shields.io/badge/Node.js-000000?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-000000?style=for-the-badge&logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens)
![Git](https://img.shields.io/badge/Git-000000?style=for-the-badge&logo=git)
![Gemini](https://img.shields.io/badge/Gemini-AI-000000?style=for-the-badge&logo=google)

---

## 🧩 System Architecture

```
Frontend (React + Vite)
        │
        ▼
Backend API (Node.js + Express)
        │
        ▼
Google Gemini AI Service
        │
        ▼
MongoDB Atlas Database
```

---

## 📂 Project Structure

```
client/
 ├── src/
 │   ├── components/
 │   ├── pages/
 │   └── services/

server/
 ├── routes/
 ├── controllers/
 ├── services/
 │   └── ai.service.js
 └── server.js
```

---

## ⚙️ Local Setup Instructions

### Backend

```bash
cd server
npm install
cp .env.example .env
```

Update `.env`:

```
PORT=5000
AI_API_KEY=your_gemini_api_key
JWT_SECRET=your_secure_secret
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
```

Start backend:

```bash
npm run dev
```

Backend URL:  
http://localhost:5000

---

### Frontend

```bash
cd client
npm install
npm run dev
```

Frontend URL:  
http://localhost:5173

---

## 📡 API Endpoints

### POST `/api/ai/generate`

Request:

```json
{
  "prompt": "Explain JavaScript closures",
  "mode": "explain"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "mode": "explain",
    "response": "..."
  }
}
```

---

### GET `/api/ai/modes`

Returns available task modes.

---

## 🧠 Prompt Engineering Strategy

User input is wrapped inside structured prompts before being sent to the AI model.

Each prompt includes:

- Role definition
- Context specification
- Explicit rules & constraints
- Output format instructions
- Guardrails to reduce hallucinations

Different modes use specialized templates to ensure accuracy and consistency.

---

## 🔐 Environment Variables

```
AI_API_KEY=your_api_key
JWT_SECRET=your_secret
MONGODB_URI=your_connection_string
PORT=5000
NODE_ENV=production
```

⚠️ Never commit real secrets.  
Use `.env.example` as a template.

---

## 🌍 Deployment

- Frontend → Vercel  
- Backend → Render  
- Database → MongoDB Atlas  
- AI Service → Google Gemini API  

Ensure environment variables are configured on the hosting platform.

---

## ✅ Assignment Objectives Covered

- Full-stack MERN application  
- AI integration via service layer  
- Structured prompt engineering  
- Secure authentication  
- Input validation & error handling  
- Clean scalable architecture  
- Production deployment  

---

## 👨‍💻 Author

**Om Maurya**  
B.Tech — Computer Science Engineering  
Kamla Nehru Institute of Technology (KNIT), Sultanpur  

GitHub: https://github.com/ommaurya-pivetra
