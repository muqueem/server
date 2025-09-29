import express from "express";
import { purchaseSubscription, renewSupport, getUserSubscriptions, getSubscriptionByToken } from "../controllers/subscriptionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/purchase", authMiddleware, purchaseSubscription);
router.post("/renew-support", authMiddleware, renewSupport);
router.get("/my", authMiddleware, getUserSubscriptions);
router.get("/success/:token", authMiddleware, getSubscriptionByToken);

export default router;
