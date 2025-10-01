import Subscription from "../models/Subscription.js";

export const getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find().populate("userId").populate("productId");
        if (!subscriptions) res.status(404).json({ message: "No subscrpition purchased" });
        
        res.json(subscriptions);
    } catch (error) {
        console.error("Error in getAllSubscriptions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}