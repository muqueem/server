import express from "express";
import { register, login } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/verify", authMiddleware, async (req, res) => {
    return res.status(200).json({ isUserLoggedIn: true, user: req.user });
})

export default router;