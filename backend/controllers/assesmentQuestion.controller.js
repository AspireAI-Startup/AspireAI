import { AssessmentQuestion } from "../models/assessmentQuestion.model";

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


export { addQuestion, getQuestions };