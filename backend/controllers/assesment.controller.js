import { AssessmentQuestion } from "../models/assessmentQuestion.model.js";
import { AssessmentSubmission } from "../models/assessmentSubmission.model.js";
import { askAI } from '../Gemini.js'

import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";



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


// Assesment Submission Controller
const processAIResponse = (text) => {
    if (!text) return "";

    // Limit response length (500 words max)
    const maxWords = 500;
    const words = text.split(" ");
    if (words.length > maxWords) {
        text = words.slice(0, maxWords).join(" ") + "...";
    }

    // Remove excessive repetitions
    const uniqueSentences = new Set(text.split(". "));
    return [...uniqueSentences].join(". ");
};

const submitAssesment = async (req, res) => {
    try {
        const { userId, responses } = req.body;

        console.log("🟢 Received Assessment Submission:", req.body);

        if (!userId || !responses || !Array.isArray(responses)) {
            return res.status(400).json({ error: "Invalid request data." });
        }

        // Fetch all related questions
        const questions = await AssessmentQuestion.find({
            _id: { $in: responses.map(r => r.questionId) }
        });

        if (!questions.length) {
            return res.status(400).json({ error: "Questions not found." });
        }

        // **Using Promise.allSettled() to handle AI calls gracefully**
        const aiResponses = await Promise.allSettled(
            responses.map(async (response) => {
                const question = questions.find(q => q._id.toString() === response.questionId);
                if (!question) return null;

                try {
                    console.log(`🟠 Sending to AI: Question: ${question.questionText}, Answer: ${response.answer}`);
                    let aiResponse = await askAI(question.questionText, response.answer);

                    // Process AI response
                    aiResponse = processAIResponse(aiResponse);

                    console.log(`🟣 Processed AI Response: ${aiResponse}`);

                    return aiResponse ? { questionId: question._id, aiResponse } : null;
                } catch (err) {
                    console.error("❌ AI Error:", err.message);
                    return null;
                }
            })
        );

        // Extract successful AI responses
        const validAiResponses = aiResponses
            .filter(r => r.status === "fulfilled" && r.value !== null)
            .map(r => r.value);

        // Save submission to MongoDB with proper error handling
        try {
            const submission = new AssessmentSubmission({
                userId,
                responses,
                aiGeneratedResponses: validAiResponses,
            });

            await submission.save();
            console.log("✅ Successfully saved assessment to MongoDB.");
        } catch (mongoError) {
            console.error("❌ MongoDB Save Error:", mongoError);
            return res.status(500).json({ error: "Failed to save assessment to MongoDB." });
        }

        // **AWS Lambda Invocation using SDK v3**
        try {
            const lambdaCommand = new InvokeCommand({
                FunctionName: "career-counseling-app-dev-saveAssessment",
                InvocationType: "Event",
                Payload: JSON.stringify({ userId, responses }),
            });

            await lambda.send(lambdaCommand);
            console.log("✅ Successfully invoked AWS Lambda.");
        } catch (lambdaError) {
            console.error("❌ Lambda Invocation Error:", lambdaError);
        }

        return res.status(201).json({
            message: "Assessment submitted successfully",
        });

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