// AI Assistant for One Piece Portfolio
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

class PirateAI {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.apiKey = null;
        this.init();
    }

    init() {
        this.createChatWidget();
        this.setupEventListeners();
        this.addWelcomeMessage();
    }

    createChatWidget() {
        // Create chat button (Den Den Mushi)
        const chatButton = document.createElement("div");
        chatButton.id = "pirate-chat-button";
        chatButton.innerHTML = `
            <div class="den-den-mushi">
                🐌
                <div class="notification-dot"></div>
            </div>
        `;

        // Create chat window
        const chatWindow = document.createElement("div");
        chatWindow.id = "pirate-chat-window";
        chatWindow.innerHTML = `
            <div class="chat-header">
                <div class="chat-title">
                    <span class="den-den-icon">🐌</span>
                    <span>Captain's AI Mate</span>
                </div>
                <button class="chat-close" id="chat-close-btn">×</button>
            </div>
            <div class="chat-messages" id="chat-messages"></div>
            <div class="chat-input-container">
                <input type="text" id="chat-input" placeholder="Ask me about the captain's adventures..." maxlength="500">
                <button id="chat-send-btn">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
            <div class="chat-loading" id="chat-loading" style="display: none;">
                <div class="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <span>Den Den Mushi is thinking...</span>
            </div>
        `;

        document.body.appendChild(chatButton);
        document.body.appendChild(chatWindow);
    }

    setupEventListeners() {
        const chatButton = document.getElementById("pirate-chat-button");
        const chatWindow = document.getElementById("pirate-chat-window");
        const closeBtn = document.getElementById("chat-close-btn");
        const sendBtn = document.getElementById("chat-send-btn");
        const input = document.getElementById("chat-input");

        chatButton.addEventListener("click", () => this.toggleChat());
        closeBtn.addEventListener("click", () => this.closeChat());
        sendBtn.addEventListener("click", () => this.sendMessage());

        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") this.sendMessage();
        });

        // Close chat when clicking outside
        document.addEventListener("click", (e) => {
            if (
                !chatWindow.contains(e.target) &&
                !chatButton.contains(e.target) &&
                this.isOpen
            ) {
                this.closeChat();
            }
        });
    }

    toggleChat() {
        const chatWindow = document.getElementById("pirate-chat-window");
        const notification = document.querySelector(".notification-dot");

        if (this.isOpen) {
            this.closeChat();
        } else {
            chatWindow.classList.add("open");
            this.isOpen = true;
            notification.style.display = "none";
            document.getElementById("chat-input").focus();
        }
    }

    closeChat() {
        const chatWindow = document.getElementById("pirate-chat-window");
        chatWindow.classList.remove("open");
        this.isOpen = false;
    }

    addWelcomeMessage() {
        const welcomeMsg = {
            type: "bot",
            content: `Ahoy there, brave sailor! 🏴‍☠️ I'm the Captain's AI mate, ready to help you navigate through this portfolio. Ask me about the captain's skills, projects, or anything else you'd like to know about this legendary developer!`,
            timestamp: new Date(),
        };
        this.messages.push(welcomeMsg);
        this.renderMessage(welcomeMsg);
    }

    async sendMessage() {
        const input = document.getElementById("chat-input");
        const message = input.value.trim();

        if (!message) return;

        // Add user message
        const userMsg = {
            type: "user",
            content: message,
            timestamp: new Date(),
        };

        this.messages.push(userMsg);
        this.renderMessage(userMsg);
        input.value = "";

        // Show loading
        this.showLoading(true);

        try {
            // Get AI response
            const response = await this.getAIResponse(message);

            const botMsg = {
                type: "bot",
                content: response,
                timestamp: new Date(),
            };

            this.messages.push(botMsg);
            this.renderMessage(botMsg);
        } catch (error) {
            console.error("AI Response Error:", error);
            const errorMsg = {
                type: "bot",
                content:
                    "Arrr! The Den Den Mushi seems to be having trouble connecting to the Grand Line. Please try again, matey!",
                timestamp: new Date(),
            };
            this.renderMessage(errorMsg);
        } finally {
            this.showLoading(false);
        }
    }

    async getAIResponse(userMessage) {
        const portfolioContext = `
        You are a pirate-themed AI assistant for a One Piece inspired developer portfolio website. 
        
        The developer's background:
        - Started coding journey in 2019
        - Specializes in full-stack development
        - Has experience with React, Node.js, Python, MongoDB, PostgreSQL
        - Led development teams on multiple projects
        - Located in New York (coordinates: 40.7128° N, 74.0060° W)
        - Available for remote work worldwide
        
        Key projects mentioned:
        1. "Treasure Hunt Game" - Interactive web game with React, Node.js, MongoDB
        2. "Crew Management System" - Full-stack application with Vue.js, Laravel, MySQL
        3. "Jolly Roger Analytics" - Business intelligence dashboard with D3.js, FastAPI, Redis
        
        Skills include: JavaScript, Python, React, Vue.js, Node.js, MongoDB, PostgreSQL, Git, Docker, AWS
        
        Contact info:
        - Email: captain@pirateportfolio.com
        - Phone: +1 (555) PIRATE-1
        - LinkedIn: linkedin.com/in/piratedev
        
        Always respond in a friendly, pirate-themed manner using One Piece references when appropriate. 
        Use phrases like "Ahoy!", "matey", "sailing the digital seas", etc. 
        Be helpful and informative about the developer's skills and projects.
        Keep responses concise but engaging.
        `;

        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: userMessage,
                context: portfolioContext,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to get AI response");
        }

        const data = await response.json();
        return data.response;
    }

    renderMessage(message) {
        const messagesContainer = document.getElementById("chat-messages");
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${message.type}`;

        const time = message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

        messageDiv.innerHTML = `
            <div class="message-content">${message.content}</div>
            <div class="message-time">${time}</div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showLoading(show) {
        const loading = document.getElementById("chat-loading");
        loading.style.display = show ? "flex" : "none";

        if (show) {
            const messagesContainer = document.getElementById("chat-messages");
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
}

// Initialize the AI assistant when the page loads
document.addEventListener("DOMContentLoaded", () => {
    new PirateAI();
});
