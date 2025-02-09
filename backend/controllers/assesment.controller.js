import { AssessmentQuestion } from "../models/assessmentQuestion.model";
import { AssessmentSubmission } from "../models/assessmentSubmission.model";

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

        res.status(201).json({message: "Question added successfully"});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getQuestions = async (req, res) => {
    try {
        
        const { academicLevel, stream, interest } = req.query;

        const questions = await AssessmentQuestion.find({
            academicLevel, stream, interest
        });

        res.status(200).json(questions);

    } catch (error) {
        res.status(500).json({message: error.message});
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

        res.status(201).json({ message: "Assessment submitted successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSubmissionHistory = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const submissions = await AssessmentSubmission.find({ userId }).populate("responses.questionId").sort({ createdAt: -1 });

        if (submissions.length === 0) {
            return res.status(404).json({ message: "No submission history found" });
        }

        res.status(200).json({ message: "Submission history retrieved", submissions });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export { addQuestion, getQuestions, submitAssesment, getSubmissionHistory };