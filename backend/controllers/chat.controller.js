import Chat from "../models/chatSchema.js";


const getChatByUser = async (req, res) => {
    const userId = req.query;

    try {
        const chat = await Chat.find(userId).sort({ timestamp: -1 }).limit(1000).exec();
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        return res.status(200).json(chat);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export { getChatByUser }