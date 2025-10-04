import dotenv from "dotenv";
dotenv.config(); // ✅ Load .env here in case this is imported first

import crypto from "crypto";
import Subscription from "../models/Subscription.js";
import Product from "../models/Product.js";
import Stripe from "stripe";

// ✅ Use Stripe key safely
const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
  console.error("❌ STRIPE_SECRET_KEY not found in environment");
  process.exit(1);
}

const stripe = new Stripe(stripeKey);

// 💳 Start Stripe checkout for subscription
export const purchaseSubscription = async (req, res) => {
  try {
    const { productId, planName } = req.body;
    const userId = req.userId;

    // 1. Find product
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // 2. Check plan exists
    const selectedPlan = product.plans.find(
      (p) => p.name.toLowerCase() === planName.toLowerCase()
    );
    if (!selectedPlan) {
      return res.status(400).json({ message: "Plan not found for this product" });
    }

    // 3. Prevent duplicate subscription
    const existing = await Subscription.findOne({ userId, productId });
    if (existing) {
      return res.status(400).json({ message: "You already own this plan" });
    }

    // 4. Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment", // one-time purchase
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: selectedPlan.currency.toLowerCase(),
            product_data: {
              name: `${product.name} - ${selectedPlan.name}`,
            },
            unit_amount: selectedPlan.price * 100, // cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId,
        productId: product._id.toString(),
        planName: selectedPlan.name,
      },
      success_url: `${process.env.CLIENT_URL}/success/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.json({ url: session.url });
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

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Find the plan used in this subscription
    const plan = subscription.productId.plans.find(
      (p) => p.name.toLowerCase() === subscription.planName.toLowerCase()
    );

    if (!plan) {
      return res.status(400).json({ message: "Plan not found for renewal" });
    }

    // 💰 Renewal price from plan.renew
    const renewalPrice = plan.renew;
    const currency = plan.currency.toLowerCase();

    // ✅ Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: `${subscription.productId.name} - Support Renewal`,
            },
            unit_amount: renewalPrice * 100, // cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        subscriptionId: subscription._id.toString(),
        type: "renewal",
      },
      success_url: `${process.env.CLIENT_URL}/my-account/my-subscription`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("❌ Error in renewSupport:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getSubscriptionByToken = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const subscription = await Subscription.findOne({
      stripeSessionId: sessionId,
    }).populate("productId");

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

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
