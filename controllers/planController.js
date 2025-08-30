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
        const plan = await Plan.findOne({ _id: planId });
        res.json(plan);
    } catch (error) {
        console.error("Error in getPlanById:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


export const seedPlans = async (req, res) => {
    try {
        await Plan.deleteMany();

        const plans = [
            {
                name: "Basic Plan",
                price: 3.42, 
                durationDays: 30,
                features: [
                    "Live stock prices (15-min delay)",
                    "Access to 10 watchlist stocks",
                    "Basic market news updates",
                    "Email alerts for top gainers/losers"
                ]
            },
            {
                name: "Standard Plan",
                price: 9.15,
                durationDays: 90,
                features: [
                    "Real-time stock prices (NSE/BSE)",
                    "Unlimited watchlists",
                    "Basic technical analysis charts",
                    "Priority support",
                    "Premium market news & insights"
                ]
            },
            {
                name: "Premium Plan",
                price: 17.16,
                durationDays: 180,
                features: [
                    "All Standard features",
                    "AI-powered stock recommendations",
                    "Advanced analytics dashboard",
                    "Portfolio tracking with P/L",
                    "24/7 customer support"
                ]
            }
        ];

        await Plan.insertMany(plans);

        res.json({ message: "Plans seeded successfully" });
    } catch (error) {
        console.error("Error in seedPlans:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}