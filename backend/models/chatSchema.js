import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    question: String,
    answer: String,
    response: String,
    timestamp: { type: Date, default: Date.now }
});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;