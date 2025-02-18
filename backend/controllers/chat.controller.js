import Chat from "../models/chatSchema.js";

const getChatByUser = async (req, res) => {
    const { userId } = req.query; 

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const chat = await Chat.find({ userId }).sort({ timestamp: -1 }).limit(1000).exec();

        if (!chat || chat.length === 0) {
            return res.status(404).json({ message: "No chat history found for this user" });
        }

        return res.status(200).json(chat);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export { getChatByUser };