import AWS from "aws-sdk";

AWS.config.update({ region: "ap-south-1" });

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "AssessmentSubmissions";

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

        const params = {
            TableName: TABLE_NAME,
            Item: {
                userId: String(userId),
                timestamp: Date.now(),
                responses,
            },
        };

        console.log("📝 Writing to DynamoDB:", JSON.stringify(params, null, 2));
        await dynamoDB.put(params).promise();
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
