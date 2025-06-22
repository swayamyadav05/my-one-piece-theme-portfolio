// Backend server for AI Assistant
const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// API route for chat
app.post("/api/chat", async (req, res) => {
    try {
        const { message, context } = req.body;
        const aiResponse = await getAIResponse(message, context);
        res.json({ response: aiResponse });
    } catch (error) {
        console.error("Chat API Error:", error);
        res.status(500).json({ error: "Failed to process chat request" });
    }
});

// All other non-API routes are sent to the index.html file
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// AI Response function using OpenRouter
async function getAIResponse(userMessage, context) {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        throw new Error("OpenRouter API key not found");
    }

    const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://swayam-pirate-portfolio.vercel.app",
                "X-Title": "One Piece Portfolio",
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-r1-0528:free",
                messages: [
                    { role: "system", content: context },
                    { role: "user", content: userMessage },
                ],
                max_tokens: 300,
                temperature: 0.7,
            }),
        }
    );

    if (!response.ok) {
        const errorData = await response.text();
        console.error("OpenRouter API Error:", errorData);
        throw new Error(`OpenRouter API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
