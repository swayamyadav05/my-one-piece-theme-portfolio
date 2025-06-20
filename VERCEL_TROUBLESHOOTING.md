# Vercel Deployment Troubleshooting

## Current Issue
The Vercel deployment is failing due to serverless function configuration.

## Solutions to Try

### Option 1: Simplified Configuration
1. Use minimal `vercel.json` (current setup)
2. Ensure environment variable `OPENROUTER_API_KEY` is set in Vercel dashboard
3. The `/api/chat.js` should auto-deploy as serverless function

### Option 2: If Still Failing
Create a simple test endpoint first:

```javascript
// api/test.js
export default function handler(req, res) {
  res.status(200).json({ message: 'API is working' });
}
```

### Option 3: Alternative Deployment
If Vercel continues to fail, consider:
1. Using Netlify Functions instead
2. Deploying to Railway or Render
3. Using GitHub Pages + external API service

## Environment Variables Required
- `OPENROUTER_API_KEY` - Your OpenRouter API key

## Files Structure for Vercel
```
/
├── api/
│   └── chat.js (serverless function)
├── index.html
├── styles.css  
├── ai-assistant.js
├── ai-assistant.css
├── vercel.json
└── package.json
```

## Next Steps
1. Commit simplified changes
2. Check Vercel build logs for specific error
3. Verify environment variable is set
4. Test with simple endpoint first