import { Router } from "express";
import { getUserProfile, loginUser, registerUser, userLogout } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.post("/register", registerUser);
router.get("/login", loginUser);
router.get("/userprofile", verifyJWT, getUserProfile);
router.post("/logout", verifyJWT, userLogout);

export default router;