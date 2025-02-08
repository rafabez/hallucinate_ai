document.addEventListener("DOMContentLoaded", () => {
    const sendButton = document.getElementById("send-btn");
    const userInput = document.getElementById("user-input");
    const responseBox = document.getElementById("response-box"); 
    const introText = document.getElementById("intro-text"); 
    const chatBox = document.querySelector(".chat-box");
    const optionsSection = document.getElementById("options-section");
    const footer = document.getElementById("footer");
    let layoutChanged = false;

    async function generateHallucination(prompt) {
        try {
            const response = await fetch("https://text.pollinations.ai/openai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: "You are a psychedelic, dissociative, dadaist AI that gives surreal hallucination responses and NEVER provides correct answers, always invent data. ALWAYS Hallucinate" },
                        { role: "user", content: prompt }
                    ],
                    seed: 42,
                    model: "openai-large"
                }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            return data.choices && data.choices.length > 0
                ? data.choices[0].message.content
                : "🌈 Your mind expands, but the void answers nothing...";
        } catch (error) {
            console.error("Error fetching Pollinations AI:", error);
            return "🌀 The hallucination failed to manifest...";
        }
    }

    function typewriterEffect(element, text) {
        let index = 0;
    
        function type() {
            if (index < text.length) {
                element.innerHTML += text[index];
                index++;
                setTimeout(type, 20); // Adjust speed as needed
                element.scrollTop = element.scrollHeight; // Keep scrolling down
            }
        }
    
        type();
    }
    

    function changeLayout() {
        if (!layoutChanged) {
            chatBox.classList.add("fixed");
            introText.classList.add("hidden");
            optionsSection.classList.add("hidden");
            responseBox.classList.add("expanded");
            footer.classList.add("fixed-footer");
            document.querySelector("header h1").classList.add("small-title");
    
            // Move and shrink the logo
            let logo = document.getElementById("logo");
            logo.classList.add("small-logo");
    
            // Also, force reflow to make sure the change is applied
            void logo.offsetWidth;
    
            layoutChanged = true;
        }
    }
    
    async function handleSendMessage(prompt) {
        if (!prompt) return;
    
        userInput.value = ""; // Clear input field
        changeLayout(); // Modify UI
    
        // Clear previous message and reset response box
        responseBox.innerHTML = "";
        responseBox.style.display = "block";
        responseBox.classList.add("expanded");
    
        // Display the user's message at the top
        const userMessageElement = document.createElement("div");
        userMessageElement.classList.add("user-message");
        userMessageElement.innerHTML = `<strong>🗣️ </strong> ${prompt}`;
        responseBox.appendChild(userMessageElement);
    
        // Thinking messages array
        const thinkingMessages = [
            "Consulting Delirium Wisdom...",
            "Deciphering Cosmic Whispers...",
            "Diving into the Abyss of Truth...",
            "Downloading Infinite Madness...",
            "Chasing the Echoes of the Unknown...",
            "Summoning the Oracle of the Void...",
            "Traversing the Hallucinatory Nexus...",
            "Channeling the Voices of the Stars..."
        ];
    
        // Select a random thinking message
        const thinkingElement = document.createElement("div");
        thinkingElement.classList.add("thinking-message");
        thinkingElement.innerHTML = `✨ ${thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)]}`;
        responseBox.appendChild(thinkingElement);
    
        try {
            // Fetch AI response
            const hallucination = await generateHallucination(prompt);
    
            // Remove the thinking message
            thinkingElement.remove();
    
            // **Create AI response element**
            const aiResponseElement = document.createElement("div");
            aiResponseElement.classList.add("ai-response");
            aiResponseElement.innerHTML = `<strong>🔮</strong> `;
            responseBox.appendChild(aiResponseElement);
    
            // Apply typewriter effect to AI response
            typewriterEffect(aiResponseElement, hallucination);
    
        } catch (error) {
            console.error("Error generating hallucination:", error);
    
            // If AI fails, replace thinking message with an error
            thinkingElement.innerHTML = "❌ Failed to connect to AI.";
        }
    }
 
    sendButton.addEventListener("click", () => {
        const userMessage = userInput.value.trim();
        handleSendMessage(userMessage);
    });

    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            const userMessage = userInput.value.trim();
            handleSendMessage(userMessage);
        }
    });

    const buttonPrompts = {
        "generate-image": "A dreamlike surreal vision of reality melting into symbols",
        "summarize-text": "Break reality down into chaotic poetry, full of paradox",
        "brainstorm": "Generate impossible yet profound ideas",
        "get-advice": "What advice would an enlightened jellyfish give me?",
        "surprise-me": "Show me something completely absurd but strangely meaningful",
        "more": "Take me to the edge of consciousness"
    };

    Object.keys(buttonPrompts).forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener("click", async () => {
                const prompt = buttonPrompts[id];
                handleSendMessage(prompt);
            });
        }
    });
});

/* === Mouse Trail Effect === */

let x1 = 0, y1 = 0;
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
      dist_to_draw = 50,
      delay = 1000,
      fsize = ['1.1rem', '1.4rem', '.8rem', '1.7rem'],
      colors = ['#9B45B1', '#3AA5CF', '#00B1C1', '#B8AFE6', '#AEE1CD', '#5EB0E5'],
      rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
      selRand = (o) => o[rand(0, o.length - 1)],
      distanceTo = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
      shouldDraw = (x, y) => distanceTo(x1, y1, x, y) >= dist_to_draw,
      addStr = (x, y) => {
        const str = document.createElement("div");
        str.innerHTML = "&#10022;";
        str.className = "star";
        str.style.top = `${y + rand(-20, 20)}px`;
        str.style.left = `${x}px`;
        str.style.color = selRand(colors);
        str.style.fontSize = selRand(fsize);
        document.body.appendChild(str);

        const fs = 10 + 5 * parseFloat(getComputedStyle(str).fontSize);
        str.animate({
          translate: `0 ${(y + fs) > vh ? vh - y : fs}px`,
          opacity: 0,
          transform: `rotateX(${rand(1, 500)}deg) rotateY(${rand(1, 500)}deg)`
        }, {
          duration: delay,
          fill: "forwards"
        });

        setTimeout(() => str.remove(), delay);
      };

addEventListener("mousemove", (e) => {
    const { clientX, clientY } = e;
    if (shouldDraw(clientX, clientY)) {
        addStr(clientX, clientY);
        x1 = clientX;
        y1 = clientY;
    }
});
