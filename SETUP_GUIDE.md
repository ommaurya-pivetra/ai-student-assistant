# Quick Setup Guide

## Prerequisites
- Node.js v16+
- Google Gemini API key: https://ai.google.dev/

## Backend
```bash
cd server
npm install
cp .env.example .env
# Add AI_API_KEY in .env
npm run dev
```
API runs on: http://localhost:5000

## Frontend (new terminal)
```bash
cd client
npm install
npm run dev
```
App runs on: http://localhost:5173

## Quick Test
Open http://localhost:5173 and try:
- Explain: "Explain JavaScript promises"
- MCQ: "React hooks"
- Summarize: paste a long article
- Improve: "i goes to school everyday and learning new thing"

## Common Issues
- Missing module: run `npm install` in both `server` and `client`
- Auth failed: check `AI_API_KEY` in `server/.env`, then restart server
- Port in use: set `PORT=5001` in `server/.env`

## Production Deployment
See README.md for full deployment instructions.
