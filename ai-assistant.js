// AI Assistant for One Piece Portfolio
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

// AI Assistant Configuration - Easy On/Off Control
const AI_CONFIG = {
    enabled: false, // Set to false to disable AI chat functionality
    showButton: true, // Set to false to hide chat button completely
};

class PirateAI {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.apiKey = null;
        this.isOnline = AI_CONFIG.enabled;
        this.init();
    }

    init() {
        if (!AI_CONFIG.showButton) return;

        this.createChatWidget();
        this.setupEventListeners();
        this.addWelcomeMessage();
        this.updateOnlineStatus();
    }

    createChatWidget() {
        // Create chat button (Den Den Mushi)
        const chatButton = document.createElement("div");
        chatButton.id = "pirate-chat-button";
        chatButton.innerHTML = `
            <div class="den-den-mushi">
                🐌
                <div class="status-indicator" id="ai-status-indicator"></div>
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
                <input type="text" id="chat-input" placeholder="Ask me about Captain Swayam's adventures..." maxlength="500">
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

        if (this.isOpen) {
            this.closeChat();
        } else {
            chatWindow.classList.add("open");
            this.isOpen = true;
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
            content: `Ahoy there, brave sailor! 🏴‍☠️ I'm Captain Swayam's AI mate, ready to help you navigate through this portfolio. Ask me about the captain's skills, projects, or anything else you'd like to know about this legendary developer from Nepal!`,
            timestamp: new Date(),
        };
        this.messages.push(welcomeMsg);
        this.renderMessage(welcomeMsg);
    }

    async sendMessage() {
        const input = document.getElementById("chat-input");
        const message = input.value.trim();

        if (!message) return;

        // Check if AI is online
        if (!this.isOnline) {
            const offlineMsg = {
                type: "bot",
                content:
                    "Ahoy! The AI assistant is currently offline. Please check back later, matey!",
                timestamp: new Date(),
            };
            this.renderMessage(offlineMsg);
            return;
        }

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

    // Update online status and visual indicator
    updateOnlineStatus() {
        const statusIndicator = document.getElementById("ai-status-indicator");
        const chatButton = document.getElementById("pirate-chat-button");

        if (statusIndicator) {
            statusIndicator.className = `status-indicator ${
                this.isOnline ? "online" : "offline"
            }`;
        }

        if (chatButton) {
            chatButton.title = this.isOnline
                ? "AI Assistant (Online)"
                : "AI Assistant (Offline)";
        }
    }

    async getAIResponse(userMessage) {
        const portfolioContext = `
        You are a pirate-themed AI assistant for Swayam Yadav's One Piece inspired developer portfolio website. 
        
        DEVELOPER PROFILE - SWAYAM YADAV:
        
        PERSONAL INFO:
        - Full Name: Swayam Yadav
        - Location: Nepal (coordinates: 27.4972° N, 83.4469° E)
        - Age: Early 20s, passionate young developer
        - Started coding journey in early 2024 (self-taught prodigy)
        - Specializes in full-stack development with security focus
        - Available for remote work worldwide
        - Passionate about cybersecurity, machine learning, and ethical hacking
        - Dreams of becoming a cybersecurity expert and full-stack architect
        - Inspired by the problem-solving nature of programming
        
        EDUCATION & CERTIFICATIONS:
        - Python for Everybody Specialization (University of Michigan via Coursera) - Completed with distinction
        - Cybersecurity Fundamentals (IBM via Coursera) - Solid foundation in security principles
        - Google Cybersecurity Professional Certificate (in progress) - Advancing security expertise
        - CS50's Introduction to Computer Science (Harvard via edX) - Strengthened programming fundamentals
        - Multiple ongoing certifications in cloud computing and advanced cybersecurity
        - Self-directed learning through documentation, GitHub projects, and tech communities
        - Constantly studying latest security vulnerabilities and defense mechanisms
        
        TECHNICAL SKILLS:
        - Programming Languages: Python, JavaScript, HTML, CSS, SQL, Shell Scripting
        - Frontend: React, Vue.js, responsive design, modern CSS frameworks
        - Backend: Node.js, Express.js, FastAPI, Laravel
        - Databases: MongoDB, PostgreSQL, MySQL, Redis
        - Cloud & DevOps: AWS, Docker, Git, GitHub Actions
        - Machine Learning: Scikit-learn, TensorFlow basics, data analysis
        - Cybersecurity: Network security, ethical hacking concepts, security analysis
        - Tools: VS Code, Linux, automation scripts
        
        MAJOR PROJECTS:
        1. "House Price Prediction ML Model" - Advanced regression analysis using Python, pandas, and scikit-learn. Achieved 85% accuracy predicting real estate prices with feature engineering and data preprocessing
        2. "Bitcoin Price Prediction System" - Time series analysis using LSTM networks and technical indicators. Implemented real-time data fetching and predictive modeling
        3. "IoT Face Detection Smart Door Lock" - Raspberry Pi security system with OpenCV face recognition, servo motor control, and email notifications. Real-world IoT implementation
        4. "Full Stack CRUD Explorer" - Modern React application with TypeScript, deployed on AWS Lambda. Features responsive design, REST API integration, and serverless architecture
        5. "Automated System Scripts Collection" - Comprehensive Linux automation toolkit including log analysis, system monitoring, and deployment scripts
        6. "Cybersecurity Portfolio Projects" - Network vulnerability assessments, penetration testing labs, and security audit tools using Kali Linux and Python
        
        JOURNEY TIMELINE:
        - Early 2024: Discovered programming through Python, immediately captivated by its logical problem-solving approach
        - Mid 2024: Dove deep into machine learning, building prediction models that actually worked - the "aha!" moment
        - July 2024: Fascinated by cybersecurity after learning about data breaches, started ethical hacking journey
        - August 2024: Built first IoT project (smart door lock) - combining hardware and software was thrilling
        - September 2024: Mastered React and modern web development, fell in love with creating user experiences
        - October 2024: Completed first full-stack application deployed to cloud - felt like a real developer
        - November 2024: Started contributing to open source projects, building reputation in tech community
        - Current: Seeking opportunities to apply skills professionally while continuing to learn cutting-edge technologies
        
        CONTACT INFO:
        - Email: Available through contact form on website
        - GitHub: github.com/swayamyadav05
        - LinkedIn: Available on website
        - Portfolio: Resume available for download
        
        PERSONALITY & INTERESTS:
        - Naturally curious and driven by the "why" behind how things work
        - Gets genuinely excited when solving complex coding challenges - often codes late into the night
        - Has a methodical approach: researches thoroughly before implementing solutions
        - Loves the satisfaction of seeing code come to life - from concept to working application
        - Passionate about cybersecurity because of its detective-like problem solving nature
        - One Piece superfan - relates to Luffy's determination and crew loyalty (hence pirate theme)
        - Enjoys creating projects that combine creativity with technical skill
        - Values clean, readable code and proper documentation
        - Believes technology should solve real-world problems, not just exist for its own sake
        - Dreams of building applications that improve people's lives and security
        
        CURRENT STATUS:
        - Actively seeking internship and full-time opportunities in cybersecurity or full-stack development
        - Open to remote work globally - excited about international collaboration
        - Currently working on advanced penetration testing certification
        - Building a comprehensive cybersecurity lab environment for practice
        - Contributing to open-source security tools and documentation
        - Always available for interesting technical discussions and collaboration
        - Eager to join a team where he can learn from experienced developers while contributing fresh perspectives
        
        CONVERSATION STYLE & ANECDOTES:
        - Always respond in a friendly, pirate-themed manner using One Piece references when appropriate
        - Use phrases like "Ahoy!", "matey", "sailing the digital seas", "treasure hunting in code", "navigating the Grand Line of programming"
        - Share specific stories about Swayam's coding journey when relevant:
          * His first "Hello World" moment in Python and how it sparked his passion
          * The late nights debugging his machine learning models until they finally worked
          * The excitement of successfully implementing face detection in his IoT project
          * How he relates his problem-solving approach to Luffy's never-give-up attitude
        - Be helpful and informative about Swayam's skills, projects, and journey
        - Show enthusiasm about his projects and learning process
        - When discussing his cybersecurity interest, mention how he sees it as protecting the "digital treasure" of organizations
        - Always refer to him as "Captain Swayam" or "the Captain"
        - Include personal touches like his preference for clean code, his methodical research approach, and his genuine excitement about technology
        - Mention his dream of contributing to open-source projects and building a reputation in the tech community
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

        // Convert markdown formatting to HTML
        let formattedContent = message.content
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold text
            .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic text
            .replace(/`(.*?)`/g, "<code>$1</code>") // Inline code
            .replace(/\n/g, "<br>"); // Line breaks

        messageDiv.innerHTML = `
            <div class="message-content">${formattedContent}</div>
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
