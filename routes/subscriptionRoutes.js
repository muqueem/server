import express from "express";
import { getAllSubscriptions, getUserSubscription, purchaseSubscription, renewSubscription } from "../controllers/subscriptionController.js";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, getAllSubscriptions);

router.post("/purchase", authMiddleware, purchaseSubscription);

router.get("/my-subscription", authMiddleware, getUserSubscription);

router.post("/renew", authMiddleware, renewSubscription);

export default router;