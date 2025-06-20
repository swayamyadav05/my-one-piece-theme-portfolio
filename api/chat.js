export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { message, context } = req.body;
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: "API key not configured" });
        }

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer":
                        "https://swayam-pirate-portfolio.vercel.app",
                    "X-Title": "One Piece Portfolio",
                },
                body: JSON.stringify({
                    model: "deepseek/deepseek-r1-0528:free",
                    messages: [
                        { role: "system", content: context },
                        { role: "user", content: message },
                    ],
                    max_tokens: 300,
                    temperature: 0.7,
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json({ response: data.choices[0].message.content });
    } catch (error) {
        console.error("Chat API Error:", error);
        res.status(500).json({ error: "Failed to process request" });
    }
}
