import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controller/user.register.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router= Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

router.route("/logout").post(verifyJwt,logoutUser)

export default router