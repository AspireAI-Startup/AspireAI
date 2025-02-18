import { Router } from "express";
import { forgetPassword, getUserProfile, loginUser, registerUser, userLogout } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { limiter } from "../middlewares/ratelimit.js";



const router = Router()

router.post("/register", limiter, registerUser);
router.post("/login", loginUser);
router.get("/userprofile", verifyJWT, getUserProfile);
router.post("/forgetpassword", limiter, verifyJWT, forgetPassword);
router.post("/logout", verifyJWT, userLogout);

export default router;