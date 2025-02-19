import { Router } from "express";
import { getChatByUser } from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()


router.get('/getChatHistory/:userId', verifyJWT, getChatByUser)

export default router;