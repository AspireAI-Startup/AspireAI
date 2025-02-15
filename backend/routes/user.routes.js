import { Router } from "express";
import { forgetPassword, getUserProfile, loginUser, registerUser, userLogout } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { limiter } from "../middlewares/ratelimit.js";



const router = Router()

<<<<<<< HEAD
router.post("/register", limiter, registerUser);
router.get("/login", limiter, loginUser);
router.get("/userprofile", limiter, verifyJWT, getUserProfile);
router.post("/logout", limiter, verifyJWT, userLogout);
=======
router.post("/register", registerUser);
router.get("/login", loginUser);
router.get("/userprofile", verifyJWT, getUserProfile);
router.post("/forgetpassword", verifyJWT, forgetPassword);
router.post("/logout", verifyJWT, userLogout);
>>>>>>> e8bcb81b175ce9b148fdf3ae6766b943e935b503

export default router;