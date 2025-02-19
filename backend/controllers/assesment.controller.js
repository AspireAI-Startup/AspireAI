import { AssessmentQuestion } from "../models/assessmentQuestion.model.js";
import { AssessmentSubmission } from "../models/assessmentSubmission.model.js";
import { askAI } from '../Gemini.js'
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import redisClient from "../db/redis.js";


const REGION = "ap-south-1";
const TABLE_NAME = "AssessmentSubmissions";

const dynamoDBClient = new DynamoDBClient({ region: REGION });
const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient);


const lambda = new LambdaClient({ region: "ap-south-1" });

// Assesment Question Controller

const addQuestion = async (req, res) => {
    try {

        const { questionText, academicLevel, stream, interest, objectiveAnswers } = req.body;

        if (!questionText || !academicLevel || !stream || !interest || !objectiveAnswers) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newQuestion = new AssessmentQuestion({
            questionText, academicLevel, stream, interest, objectiveAnswers
        });

        await newQuestion.save();

        return res.status(201).json({ message: "Question added successfully" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getQuestions = async (req, res) => {
    try {

        const { academicLevel, stream, interest } = req.body;

        const questions = await AssessmentQuestion.find({
            academicLevel, stream, interest
        });

        return res.status(200).json(questions);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}



const processAIResponse = (text) => {
    if (!text) return "";


    const maxWords = 500;
    const words = text.split(" ");
    if (words.length > maxWords) {
        text = words.slice(0, maxWords).join(" ") + "...";
    }

    const uniqueSentences = new Set(text.split(". "));
    return [...uniqueSentences].join(". ");
};

const submitAssesment = async (req, res) => {
    try {
        const { userId, responses } = req.body;

        if (!userId || !responses || !Array.isArray(responses)) {
            return res.status(400).json({ error: "Invalid request data." });
        }

        const groupedResponses = responses.reduce((acc, response) => {
            if (!acc[response.questionId]) {
                acc[response.questionId] = [];
            }
            acc[response.questionId].push(response.answer);
            return acc;
        }, {});

        const questionIds = Object.keys(groupedResponses);
        const questions = await AssessmentQuestion.find({ _id: { $in: questionIds } });

        if (!questions.length) {
            return res.status(400).json({ error: "Questions not found." });
        }

        const aiResponses = await Promise.allSettled(
            questions.map(async (question) => {
                const answers = groupedResponses[question._id.toString()];
                if (!answers || !answers.length) return null;

                try {
                    let aiResponse = await askAI(question.questionText, answers);
                    aiResponse = processAIResponse(aiResponse);
                    return aiResponse ? { questionId: question._id.toString(), aiResponse } : null;
                } catch (err) {
                    console.error("AI Error:", err.message);
                    return null;
                }
            })
        );

        const validAiResponses = aiResponses
            .filter(r => r.status === "fulfilled" && r.value !== null)
            .map(r => r.value);

        const existindData = await redisClient.lrange("aiGeneratedResponses", 0, -1);
        const previousData = existindData.length > 0 ? existindData : [];


        const newResponses = validAiResponses.map(r => ({
            questionId: r.questionId.toString(),
            questionText: questions.find(q => q._id.toString() === r.questionId)?.questionText || "Unknown",
            aiResponse: r.aiResponse
        }));


        const updatedResponses = [...previousData, ...newResponses];
        await redisClient.lpush("aiGeneratedResponses", ...updatedResponses.map(response => JSON.stringify(response)));
        await redisClient.expire("aiGeneratedRespons", 21600);

        console.log("✅ Successfully appended new responses in Redis.");


        const params = {
            TableName: TABLE_NAME,
            Key: { userId },
            UpdateExpression: "SET responses = list_append(if_not_exists(responses, :emptyList), :newResponses), aiGeneratedResponses = list_append(if_not_exists(aiGeneratedResponses, :emptyList), :newAiResponses)",
            ExpressionAttributeValues: {
                ":newResponses": validAiResponses.map(r => ({
                    questionId: r.questionId.toString(),
                    answer: r.aiResponse
                })),
                ":newAiResponses": validAiResponses.map(r => ({
                    questionId: r.questionId.toString(),
                    aiResponse: r.aiResponse
                })),
                ":emptyList": []
            },
            ReturnValues: "UPDATED_NEW"
        };

        await dynamoDB.send(new UpdateCommand(params));
        console.log("✅ Successfully updated assessment in DynamoDB.");

        return res.status(201).json({ message: "Assessment submitted successfully" });

    } catch (error) {
        console.error("❌ Error submitting assessment:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};




const getSubmissionHistory = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const submissions = await AssessmentSubmission.find({ userId }).sort({ createdAt: -1 });

        if (submissions.length === 0) {
            return res.status(404).json({ message: "No submission history found" });
        }

        return res.status(200).json({ message: "Submission history retrieved", submissions });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export { addQuestion, getQuestions, submitAssesment, getSubmissionHistory };