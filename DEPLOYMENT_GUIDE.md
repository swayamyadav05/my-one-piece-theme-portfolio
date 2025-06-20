# Vercel Deployment Guide for One Piece Portfolio

## Setup Instructions

### 1. Environment Variables
In your Vercel dashboard, add the following environment variable:
- `OPENROUTER_API_KEY` = your_openrouter_api_key_here

### 2. Deployment Files
The project includes:
- `vercel.json` - Vercel configuration
- `api/chat.js` - Serverless function for AI chat
- All static assets (HTML, CSS, JS)

### 3. Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Set the environment variable in Vercel dashboard
3. Deploy

### 4. File Structure
```
├── api/
│   └── chat.js          # Serverless function
├── index.html           # Main page
├── styles.css          # Styles
├── ai-assistant.css    # Chat styles
├── ai-assistant.js     # Frontend chat logic
├── server.js           # Local development server
├── vercel.json         # Vercel config
└── package.json        # Dependencies
```

### 5. Local Development
- Run `node server.js` for local testing
- Visit `http://localhost:5000`

### 6. Production
- Visit your Vercel domain
- AI chat will use `/api/chat` endpoint