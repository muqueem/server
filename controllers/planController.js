import mongoose from "mongoose";
import Plan from "../models/Plan.js";


export const getPlans = async (req, res) => {
    try {
        const plans = await Plan.find({ isActive: true }).sort({ price: 1 });
        res.json(plans);
    } catch (error) {
        console.error("Error in getPlans:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


export const getPlanById = async (req, res) => {
  try {
    const { planId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(planId)) {
      return res.status(400).json({ error: "Invalid planIddddd" });
    }

    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ error: "Plan not found" });

    res.json(plan);
  } catch (error) {
    console.error("Error in getPlanById:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const seedPlans = async (req, res) => {
    try {
        await Plan.deleteMany(); // clear old plans first

        const plans = [
            // 1. Dual Force Engine EA
            {
                productSlug: "dualforceengineea",
                name: "Monthly Plan",
                price: 29.99,
                durationDays: 30,
                features: [
                    "Single MT4/MT5 license",
                    "Dual-engine trading strategy",
                    "Monthly EA updates",
                    "Basic email support"
                ]
            },
            {
                productSlug: "dualforceengineea",
                name: "Annual Plan",
                price: 299.99,
                durationDays: 365,
                features: [
                    "Multiple MT4/MT5 licenses",
                    "Priority updates",
                    "VIP support",
                    "Custom optimization assistance"
                ]
            },

            // 2. Flashedge Scalper X EA
            {
                productSlug: "flashedgescalperxea",
                name: "Monthly Plan",
                price: 34.99,
                durationDays: 30,
                features: [
                    "Single MT4/MT5 license",
                    "Ultra-fast scalping algorithm",
                    "Performance tracking dashboard",
                    "Basic support"
                ]
            },
            {
                productSlug: "flashedgescalperxea",
                name: "Annual Plan",
                price: 349.99,
                durationDays: 365,
                features: [
                    "Multiple licenses",
                    "All scalping features unlocked",
                    "Priority updates",
                    "VIP support with strategy customization"
                ]
            },

            // 3. Quantum ATR Grid EA
            {
                productSlug: "quantumatrgridea",
                name: "Monthly Plan",
                price: 39.99,
                durationDays: 30,
                features: [
                    "Single MT4/MT5 license",
                    "ATR-driven grid strategy",
                    "Monthly EA updates",
                    "Email support"
                ]
            },
            {
                productSlug: "quantumatrgridea",
                name: "Annual Plan",
                price: 399.99,
                durationDays: 365,
                features: [
                    "Multiple licenses",
                    "Lifetime access to updates",
                    "Priority technical support",
                    "Beta features access"
                ]
            },

            // 4. Quantum FVG Executor EA
            {
                productSlug: "quantumfvgexecuteorea",
                name: "Monthly Plan",
                price: 44.99,
                durationDays: 30,
                features: [
                    "Single MT4/MT5 license",
                    "Fair Value Gap execution strategy",
                    "Monthly performance reports",
                    "Basic support"
                ]
            },
            {
                productSlug: "quantumfvgexecuteorea",
                name: "Annual Plan",
                price: 449.99,
                durationDays: 365,
                features: [
                    "Multiple licenses",
                    "Advanced execution features",
                    "Priority updates",
                    "Custom strategy tuning support"
                ]
            },

            // 5. Session Sniper X EA
            {
                productSlug: "sessionsniperxea",
                name: "Monthly Plan",
                price: 49.99,
                durationDays: 30,
                features: [
                    "Single MT4/MT5 license",
                    "Optimized for London & New York sessions",
                    "ATR-based stop loss and take profit",
                    "Monthly EA updates",
                    "Email support + setup guide"
                ]
            },
            {
                productSlug: "sessionsniperxea",
                name: "Annual Plan",
                price: 499.99,
                durationDays: 365,
                features: [
                    "Multiple licenses",
                    "Advanced session breakout strategy",
                    "Priority EA updates",
                    "Dedicated account manager",
                    "Exclusive VIP group access"
                ]
            }
        ];

        await Plan.insertMany(plans);

        res.json({ message: "All Quantum Rise product subscription plans seeded successfully" });
    } catch (error) {
        console.error("Error in seedPlans:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};