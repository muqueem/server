// controllers/subscriptionController.js
import crypto from "crypto";
import Subscription from "../models/Subscription.js";
import Product from "../models/Product.js";

// 💳 Purchase a product plan (lifetime + 3 months support)
export const purchaseSubscription = async (req, res) => {
  try {
    const { productId, planName } = req.body; // planName now required
    const userId = req.userId;

    // 1. Find product
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // 2. Check plan exists in this product
    const selectedPlan = product.plans.find(
      (p) => p.name.toLowerCase() === planName.toLowerCase()
    );
    if (!selectedPlan) {
      return res
        .status(400)
        .json({ message: "Selected plan not found for this product" });
    }

    // 3. Prevent duplicate ownership of same plan
    const existing = await Subscription.findOne({
      userId,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You already own a plan" });
    }

    // 4. Calculate support end date (+3 months)
    const supportEndDate = new Date();
    supportEndDate.setMonth(supportEndDate.getMonth() + 3);
    
    const lifetime = selectedPlan.duration === "Lifetime" ? true : false

    const successToken = crypto.randomBytes(20).toString("hex");
    
    // 5. Create subscription
    const subscription = new Subscription({
      userId,
      productId,
      planName: selectedPlan.name,
      lifetime,
      supportEndDate,
      successToken,
    });

    await subscription.save();
    res
      .status(201)
      .json({ message: "Product purchased successfully", subscription, successToken });
  } catch (error) {
    console.error("Error in purchaseSubscription:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ♻️ Renew support (adds +3 months to supportEndDate)
export const renewSupport = async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    const subscription = await Subscription.findById(subscriptionId).populate("productId");
    if (!subscription)
      return res.status(404).json({ message: "Subscription not found" });

    let newSupportEndDate = new Date(subscription.supportEndDate);
    if (newSupportEndDate < new Date()) {
      newSupportEndDate = new Date();
    }
    newSupportEndDate.setMonth(newSupportEndDate.getMonth() + 3);

    subscription.supportEndDate = newSupportEndDate;
    await subscription.save();

    res.json({ message: "Support renewed for 3 months", subscription });
  } catch (error) {
    console.error("Error in renewSupport:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSubscriptionByToken = async (req, res) => {
  try {
    const { token } = req.params;

    // Find subscription by token and user
    const subscription = await Subscription.findOne({
      userId: req.userId,
      successToken: token,
    }).populate("productId");

    if (!subscription) {
      return res.status(404).json({ message: "Invalid or expired token" });
    }

    // Clear token so it can't be reused
    subscription.successToken = undefined;
    await subscription.save();

    res.json(subscription);
  } catch (error) {
    console.error("Error in getSubscriptionByToken:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// 👤 Get user’s subscriptions
export const getUserSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.findOne({ userId: req.userId }).populate("productId");
    res.json(subscriptions);
  } catch (error) {
    console.error("Error in getUserSubscriptions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
