import { AssessmentQuestion } from "../models/assessmentQuestion.model.js";
import { AssessmentSubmission } from "../models/assessmentSubmission.model.js";
import AWS from "aws-sdk";

AWS.config.update({ region: "ap-south-1" });
const lambda = new AWS.Lambda();

// Assesment Question Controller

const addQuestion = async (req, res) => {
    try {
        
        const { questionText, academicLevel, stream, interest, objectiveAnswers } = req.body;

        if(!questionText || !academicLevel || !stream || !interest || !objectiveAnswers){
            return res.status(400).json({message: "All fields are required"});
        }

        const newQuestion = new AssessmentQuestion({
            questionText, academicLevel, stream, interest, objectiveAnswers
        });

        await newQuestion.save();

        return res.status(201).json({message: "Question added successfully"});

    } catch (error) {
        return res.status(500).json({message: error.message});
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
        return res.status(500).json({message: error.message});
    }
}


// Assesment Submission Controller
const submitAssesment = async (req, res) => {
    try {

        const { userId, responses } = req.body;

        if (!userId || !responses) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newSubmission = new AssessmentSubmission({
            userId, responses
        });
        await newSubmission.save();

        const lambdaParams = {
            FunctionName: "career-counseling-app-dev-saveAssessment",
            InvocationType: "Event",
            Payload: JSON.stringify({ userId, responses }),
        };

        await lambda.invoke(lambdaParams).promise();

        return res.status(201).json({ message: "Assessment submitted successfully" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
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