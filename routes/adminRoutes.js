import express from "express";
import { getAllSubscriptions } from "../controllers/adminController.js";
import { adminMiddleware, authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/get-all-subscriptions", authMiddleware, adminMiddleware, getAllSubscriptions);

export default router;