import express from "express";
import Stripe from "stripe";
import Subscription from "../models/Subscription.js";
import crypto from "crypto";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log("Webhook verified:", event.type);
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Check for 'type' in metadata to determine flow
    if (session.metadata?.type === "renewal") {
      // ♻️ Renewal flow
      const subscription = await Subscription.findById(session.metadata.subscriptionId);

      if (subscription) {
        let newSupportEndDate = new Date(subscription.supportEndDate);
        if (newSupportEndDate < new Date()) {
          newSupportEndDate = new Date(); // Reset to now if already expired
        }
        newSupportEndDate.setMonth(newSupportEndDate.getMonth() + 3);

        subscription.supportEndDate = newSupportEndDate;
        await subscription.save();

        console.log("♻️ Support renewed:", subscription._id);
      } else {
        console.error("❌ Subscription not found for renewal:", session.metadata.subscriptionId);
      }

    } else {
      // 🆕 New purchase flow
      const { userId, productId, planName } = session.metadata;

      const supportEndDate = new Date();
      supportEndDate.setMonth(supportEndDate.getMonth() + 3);

      const newSub = new Subscription({
        userId,
        productId,
        planName,
        lifetime: true,
        supportEndDate,
        isActive: true,
        stripeSessionId: session.id,
      });

      await newSub.save();
      console.log("✅ New subscription saved:", newSub._id);
    }
  }

  res.json({ received: true });
});

export default router;
