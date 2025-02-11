import { Router } from "express";
import { addQuestion, getQuestions, getSubmissionHistory, submitAssesment } from "../controllers/assesment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/assesment-question-add", addQuestion);
router.get("/assesment-question-get", verifyJWT, getQuestions);

router.post("/assesment-submit", verifyJWT, submitAssesment);
router.get("/assesment-history/:userId", verifyJWT, getSubmissionHistory);

export default router;