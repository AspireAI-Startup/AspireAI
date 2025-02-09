import { AssessmentSubmission } from "../models/assessmentSubmission.model";

const submitAssesment = async (req, res) => {
    try {
        
        const { userId, responses } = req.body;

        if(!userId || !responses){
            return res.status(400).json({message: "All fields are required"});
        }

        const newSubmission = new AssessmentSubmission({
            userId, responses
        });
        await newSubmission.save();

        res.status(201).json({message: "Assessment submitted successfully"});

    } catch (error) {
        res.status(500).json({message: error.message});
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

export { submitAssesment, getSubmissionHistory };