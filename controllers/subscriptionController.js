import Subscription from "../models/Subscription.js";
import Plan from "../models/Plan.js";
import crypto from "crypto";

// Generate activation code
const generateActivationCode = () => {
    return crypto.randomBytes(8).toString("hex").toUpperCase();
};

export const purchaseSubscription = async (req, res) => {
    try {
        const { planId } = req.body;
        const userId = req.userId; // from authMiddleware

        const existingSub = await Subscription.findOne({ userId, isActive: true }).populate("planId");

        if (existingSub) {
            const plan = existingSub.planId;
            if (!plan) return res.status(400).json({ message: "Plan details missing for existing subscription" });

            const activationCode = generateActivationCode();

            let newStartDate = existingSub.startDate;
            let newEndDate = existingSub.endDate;

            if (new Date() > existingSub.endDate) {
                newStartDate = new Date();
                newEndDate = new Date();
                newEndDate.setDate(newEndDate.getDate() + plan.durationDays);
            } else {
                newEndDate = new Date(existingSub.endDate);
                newEndDate.setDate(newEndDate.getDate() + plan.durationDays);
            }

            existingSub.code = activationCode;
            existingSub.startDate = newStartDate;
            existingSub.endDate = newEndDate;
            existingSub.isActive = true;
            existingSub.status = "active";

            await existingSub.save();

            return res.status(200).json({ message: "Subscription renewed successfully", subscription: existingSub });
        }

        const plan = await Plan.findById(planId);
        if (!plan) return res.status(400).json({ message: "Plan not found or inactive" });

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + plan.durationDays);

        const code = generateActivationCode();

        const subscription = new Subscription({
            userId,
            planId,
            startDate,
            endDate,
            code,
            isActive: true,
            status: "active"
        });

        await subscription.save();

        return res.status(201).json({ message: "Subscription purchased successfully", subscription });
    } catch (error) {
        console.error("Error in purchaseSubscription:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const renewSubscription = async (req, res) => {
    try {
        const { subscriptionId } = req.body;

        const subscription = await Subscription.findById(subscriptionId).populate("planId");
        if (!subscription) return res.status(404).json({ message: "Subscription not found" });

        const plan = subscription.planId;
        if (!plan) return res.status(400).json({ message: "Plan details missing for Subscription" });

        const activationCode = generateActivationCode();

        let newStartDate = subscription.startDate;
        let newEndDate = subscription.endDate;

        if (new Date() > subscription.endDate) {
            newStartDate = new Date();
            newEndDate = new Date();
            newEndDate.setDate(newEndDate.getDate() + plan.durationDays);
        } else {
            newEndDate = new Date(subscription.endDate);
            newEndDate.setDate(newEndDate.getDate() + plan.durationDays);
        }

        subscription.code = activationCode;
        subscription.startDate = newStartDate;
        subscription.endDate = newEndDate;
        subscription.isActive = true;
        subscription.status = "active";

        await subscription.save();

        return res.json({ message: "Subscription renewed successfully", subscription });
    } catch (error) {
        console.error("Error in renewSubscription:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getUserSubscription = async (req, res) => {
    try {
        const userId = req.userId;
        const subscription = await Subscription.findOne({ userId, isActive: true })
            .populate("planId");

        if (!subscription) {
            return res.json(null);
        }

        return res.json(subscription);
    } catch (error) {
        console.error("Error in getUserSubscription:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find()
            .populate("userId", "name email")
            .populate("planId", "name price durationDays")
            .sort({ createdAt: -1 });

        return res.json(subscriptions);
    } catch (error) {
        console.error("Error in getAllSubscriptions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
