import { AssessmentQuestion } from "../models/assessmentQuestion.model.js";
import { AssessmentSubmission } from "../models/assessmentSubmission.model.js";
// import { aiResponse } from "../../gemini.js";

import { askAI } from "../Gemini.js";

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

        // **Using Promise.allSettled() to prevent crashes**
        const aiResponses = await Promise.allSettled(
            responses.map(async (response) => {
                const question = questions.find(q => q._id.toString() === response.questionId);

                if (!question) return null;

                try {
                    const aiResponse = await askAI(question.questionText, response.answer);

                    return aiResponse && aiResponse.trim() !== ""
                        ? { questionId: question._id, aiResponse }
                        : null;
                } catch (err) {
                    console.error("❌ AI Error:", err.message);
                    return null;
                }
            })
        );

        // Extract successful responses
        const validAiResponses = aiResponses
            .filter(r => r.status === "fulfilled" && r.value !== null)
            .map(r => r.value);

        // Save submission to MongoDB
        const submission = new AssessmentSubmission({
            userId,
            responses,
            aiGeneratedResponses: validAiResponses,
        });

        await submission.save();

        console.log("🟢 Assessment saved successfully:", submission);

        return res.status(201).json({
            message: "Assessment submitted successfully",
            submission,
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