import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const REGION = "ap-south-1"; // Your AWS region
const TABLE_NAME = "AssessmentSubmissions";

// Initialize the DynamoDB client
const dynamoDBClient = new DynamoDBClient({ region: REGION });
const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient); // DocumentClient for easier JSON handling

export const saveAssessment = async (event) => {
    console.log("📩 Received event:", JSON.stringify(event, null, 2)); // Logs the incoming request

    try {
        // Ensure correct payload format
        const requestBody = event.body ? JSON.parse(event.body) : event;
        const { userId, responses } = requestBody;

        if (!userId || !responses) {
            console.error("❌ Validation Failed: Missing userId or responses");
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "All fields are required" }),
            };
        }

        const params = new PutCommand({
            TableName: TABLE_NAME,
            Item: {
                userId: String(userId),
                timestamp: Date.now(),
                responses,
            },
        });

        console.log("📝 Writing to DynamoDB:", JSON.stringify(params, null, 2));
        await dynamoDB.send(params);
        console.log("✅ Data successfully stored in DynamoDB");

        return {
            statusCode: 201,
            body: JSON.stringify({ message: "Assessment saved in DynamoDB!" }),
        };
    } catch (error) {
        console.error("🔥 Lambda Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to save assessment", error: error.message }),
        };
    }
};
