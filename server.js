// Backend server for AI Assistant
const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Simple HTTP server to serve static files and handle API requests
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
    }

    // Handle API chat endpoint
    if (pathname === "/api/chat" && req.method === "POST") {
        try {
            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString();
            });

            req.on("end", async () => {
                try {
                    const { message, context } = JSON.parse(body);
                    const response = await getAIResponse(message, context);

                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ response }));
                } catch (error) {
                    console.error("Chat API Error:", error);
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(
                        JSON.stringify({
                            error: "Failed to process chat request",
                        })
                    );
                }
            });
        } catch (error) {
            console.error("Request Error:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Server error" }));
        }
        return;
    }

    // Serve static files
    let filePath = pathname === "/" ? "./index.html" : `.${pathname}`;

    // Security check
    if (filePath.includes("..")) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpg",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".wav": "audio/wav",
        ".mp4": "video/mp4",
        ".woff": "application/font-woff",
        ".ttf": "application/font-ttf",
        ".eot": "application/vnd.ms-fontobject",
        ".otf": "application/font-otf",
        ".wasm": "application/wasm",
    };

    const contentType = mimeTypes[extname] || "application/octet-stream";

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == "ENOENT") {
                res.writeHead(404);
                res.end("File not found");
            } else {
                res.writeHead(500);
                res.end("Server error: " + error.code);
            }
        } else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content, "utf-8");
        }
    });
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
