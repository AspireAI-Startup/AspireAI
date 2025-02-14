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



const processAIResponse = (text) => {
    if (!text) return "";


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

        
        const groupedResponses = responses.reduce((acc, response) => {
            if (!acc[response.questionId]) {
                acc[response.questionId] = [];
            }
            acc[response.questionId].push(response.answer);
            return acc;
        }, {});

        
        const questionIds = Object.keys(groupedResponses);
        const questions = await AssessmentQuestion.find({
            _id: { $in: questionIds }
        });

        if (!questions.length) {
            return res.status(400).json({ error: "Questions not found." });
        }

       
        const aiResponses = await Promise.allSettled(
            questions.map(async (question) => {
                const answers = groupedResponses[question._id.toString()];
                if (!answers || !answers.length) return null;

                try {
                    console.log(`🟠 Sending to AI: Question: ${question.questionText}, Answers: ${answers.join(", ")}`);
                    let aiResponse = await askAI(question.questionText, answers);

                    
                    aiResponse = processAIResponse(aiResponse);

                    console.log(`🟣 Processed AI Response: ${aiResponse}`);

                    return aiResponse ? { questionId: question._id, aiResponse } : null;
                } catch (err) {
                    console.error("❌ AI Error:", err.message);
                    return null;
                }
            })
        );

        
        const validAiResponses = aiResponses
            .filter(r => r.status === "fulfilled" && r.value !== null)
            .map(r => r.value);

        
        try {
            const submission = new AssessmentSubmission({
                userId,
                responses: validAiResponses.map(r => ({
                    questionId: r.questionId,
                    answer: r.aiResponse,
                })),
                aiGeneratedResponses: validAiResponses,
            });

            await submission.save();
            console.log("✅ Successfully saved assessment to MongoDB.");
        } catch (mongoError) {
            console.error("❌ MongoDB Save Error:", mongoError);
            return res.status(500).json({ error: "Failed to save assessment to MongoDB." });
        }

        
        try {
            const lambdaCommand = new InvokeCommand({
                FunctionName: "career-counseling-app-dev-saveAssessment",
                InvocationType: "Event",
                Payload: JSON.stringify({ userId, responses: validAiResponses }),
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