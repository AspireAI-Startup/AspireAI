import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const REGION = "ap-south-1";
const TABLE_NAME = "AssessmentSubmissions";

const dynamoDBClient = new DynamoDBClient({ region: REGION });
const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient);

const getChatByUser = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        let lastEvaluatedKey = null;
        let allItems = [];

        do {
            const params = {
                TableName: TABLE_NAME,
                FilterExpression: "userId = :userId",
                ExpressionAttributeValues: { ":userId": userId },
                ExclusiveStartKey: lastEvaluatedKey || undefined 
            };

            const data = await dynamoDB.send(new ScanCommand(params));

            if (data && data.Items) {
                allItems = allItems.concat(data.Items);
            }

            lastEvaluatedKey = data.LastEvaluatedKey || null;
        } while (lastEvaluatedKey); 

        if (!allItems.length) {
            return res.status(404).json({ message: "No chat history found for this user" });
        }

        
        let chatHistory = allItems.flatMap(item => [
            ...(Array.isArray(item.responses) ? item.responses : []),
            ...(Array.isArray(item.aiGeneratedResponses) ? item.aiGeneratedResponses : [])
        ]);

        chatHistory = chatHistory.map(chat => ({
            ...chat,
            timestamp: chat.timestamp || "1970-01-01T00:00:00Z"
        }));

        chatHistory.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        return res.status(200).json(chatHistory);
    } catch (error) {
        console.error("DynamoDB Scan Error:", error);
        return res.status(500).json({ message: error.message });
    }
};

export { getChatByUser };