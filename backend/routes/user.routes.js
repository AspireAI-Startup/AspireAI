import { Router } from "express";
import { loginUser, registerUser, userLogout } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.post("/register", registerUser);
router.get("/login", loginUser);
router.post("/logout", verifyJWT, userLogout);

export default router;