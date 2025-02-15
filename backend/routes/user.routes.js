import { Router } from "express";
import { forgetPassword, getUserProfile, loginUser, registerUser, userLogout } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.post("/register", registerUser);
router.get("/login", loginUser);
router.get("/userprofile", verifyJWT, getUserProfile);
router.post("/forgetpassword", verifyJWT, forgetPassword);
router.post("/logout", verifyJWT, userLogout);

export default router;