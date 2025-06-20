// Vercel serverless function for AI chat

export default async function handler(req, res) {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }

    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    try {
        const { message, context } = req.body;
        const response = await getAIResponse(message, context);

        res.status(200).json({ response });
    } catch (error) {
        console.error("Chat API Error:", error);
        res.status(500).json({
            error: "Failed to process chat request",
        });
    }
}

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
