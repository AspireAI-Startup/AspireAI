import { Router } from "express";
import { addQuestion, getQuestions, getSubmissionHistory, submitAssesment } from "../controllers/assesment.controller.js";

const router = Router();

router.post("/assesment-question-add", addQuestion);
router.get("/assesment-question-get", getQuestions);

router.post("/assesment-submit", submitAssesment);
router.get("/assesment-history/:userId", getSubmissionHistory);

export default router;