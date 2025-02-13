import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import chalk from "chalk";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import { Client as LangSmithClient } from "langsmith";


const langsmithClient = new LangSmithClient({
    apiKey: process.env.LANGSMITH_API_KEY,
    endpoint: process.env.LANGSMITH_ENDPOINT,
    project: process.env.LANGSMITH_PROJECT,
});


process.env.LANGCHAIN_TRACING = "true";

const MEMORY_FILE = "memory.json";

function loadMemory() {
    try {
        const data = fs.readFileSync(MEMORY_FILE, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return { history: [] };
    }
}

function saveMemory(memory) {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2));
}

const llm = new ChatGoogleGenerativeAI({
    modelName: "gemini-2.0-flash",
    apiKey: process.env.GEMINI_API_KEY,
    langsmith: langsmithClient, 
});

async function askAI(question, responses) {
   
    const answers = Array.isArray(responses) ? responses.map(r => r.toString()) : [responses.toString()];

    console.log(chalk.blue.bold(`\n🟠 Sending to AI: Question: ${question}, Answers: ${answers.join(", ")}\n`));

    const memory = loadMemory();
    const pastConversations = memory.history
        .map(entry => `User: ${entry.question}\nAI: ${entry.answer}`)
        .join("\n");

    try {
        const response = await llm.invoke([
            new HumanMessage({
                content: `${pastConversations}\n\nUser: Question: ${question}, Answers: ${answers.join(", ")}\n\nProvide career-related insights considering all answers together.`
            })
        ]);

        if (!response || !response.content || response.content.trim().toLowerCase() === "(silence)") {
            console.error("❌ AI returned an invalid response.");
            return "AI was unable to generate a meaningful response.";
        }

        const aiResponse = response.content.trim();

        memory.history.push({ question, answer: answers.join(", "), aiResponse });
        saveMemory(memory);

        console.log(chalk.magenta.bold(`\n🟣 AI Response: ${aiResponse}\n`));
        return aiResponse;

    } catch (error) {
        console.error("❌ AI Error:", error.message);
        return "Error generating AI response.";
    }
}

export { askAI };
