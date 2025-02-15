import dotenv from "dotenv";
dotenv.config();


import chalk from "chalk";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import { Client as LangSmithClient } from "langsmith";
import Chat from "./models/chatSchema.js";

const langsmithClient = new LangSmithClient({
    apiKey: process.env.LANGSMITH_API_KEY || "",
    endpoint: process.env.LANGSMITH_ENDPOINT || "",
    project: process.env.LANGSMITH_PROJECT || "",
});

process.env.LANGCHAIN_TRACING = "true";

const llm = new ChatGoogleGenerativeAI({
    modelName: "gemini-2.0-flash",
    apiKey: process.env.GEMINI_API_KEY || "",
    langsmith: langsmithClient,
    temperature: 0.5
});

async function askAI(question, responses) {
    const answers = Array.isArray(responses) ? responses.map(r => r.toString()) : [responses.toString()];

    // console.log(chalk.blue.bold(`\n🟠 Sending to AI: Question: ${question}, Answers: ${answers.join(", ")}\n`));

    try {

        const pastConversations = await Chat.find().sort({ timestamp: 1 }).limit(10);
        const pastConversationText = pastConversations.map(entry => `User: ${entry.question}\nAI: ${entry.response || entry.answer}`).join("\n");

        const response = await llm.invoke([
            new HumanMessage({
                content: `${pastConversationText}\n\nUser: Question: ${question}, Answers: ${answers.join(", ")}\n\nProvide career-related insights considering all answers together.`
            })
        ]);

        if (!response || !response.content || response.content.trim().toLowerCase() === "(silence)") {
            console.error("❌ AI returned an invalid response.");
            return "AI was unable to generate a meaningful response.";
        }

        const aiResponse = response.content.trim();


        const chatEntry = new Chat({
            question,
            answer: answers.join(", "),
            response: aiResponse
        });
        await chatEntry.save();

        // console.log(chalk.magenta.bold(`\n🟣 AI Response: ${aiResponse}\n`));
        return aiResponse;

    } catch (error) {
        console.error("❌ AI Error:", error.message);
        return "Error generating AI response.";
    }
}

export { askAI };
