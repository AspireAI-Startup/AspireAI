import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import chalk from "chalk"; // ✅ Add colors for better readability
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";

const MEMORY_FILE = "memory.json";

// ✅ Load memory from file
function loadMemory() {
    try {
        const data = fs.readFileSync(MEMORY_FILE, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return { history: [] };
    }
}

// ✅ Save memory to file
function saveMemory(memory) {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2));
}

const memory = loadMemory();
const llm = new ChatGoogleGenerativeAI({
    modelName: "gemini-2.0-flash",
    apiKey: process.env.GEMINI_API_KEY,
});

// ✅ Function to ask AI & format response properly
async function askAI(input) {
    if (input.toLowerCase().includes("summarize everything")) {
        if (memory.history.length > 0) {
            return chalk.yellow.bold("\n🔵 AI: Here's a summary of what I remember:\n") +
                memory.history.map((entry, index) => 
                    chalk.green(`${index + 1}. User: ${entry.question}\n   → AI: ${entry.answer}`)
                ).join("\n\n");
        } else {
            return chalk.red("\n⚠️ AI: I don't remember anything yet. Please talk to me.");
        }
    }

    // ✅ Prepare past conversation history properly
    const pastConversations = memory.history.map(entry => `User: ${entry.question}\nAI: ${entry.answer}`).join("\n");

    // ✅ Send past memory + new question to AI
    const response = await llm.invoke([
        new HumanMessage({ content: `${pastConversations}\n\nUser: ${input}` })
    ]);

    // ✅ Store conversation in memory
    memory.history.push({ question: input, answer: response.content });
    saveMemory(memory);

    // ✅ Return formatted AI response
    return chalk.cyan.bold("\n🔵 AI Response:\n") + chalk.green(response.content);
}

// ✅ Function to execute automatically
async function run() {
    const userPrompt = "Construct a code for me in Node.js (ES6) that uses RabbitMQ and Socket.IO both.";

    console.log(chalk.blue.bold(`\n🟢 Asking AI: ${userPrompt}\n`));
    const response = await askAI(userPrompt);
    console.log(response);
}

run();
