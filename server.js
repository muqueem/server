import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";  // import webhook route

dotenv.config();
const app = express();

app.use(cors({
    origin: ['https://muqueem.works.knothost.com'], // your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
// app.use(cors());

// IMPORTANT: Use express.raw only for webhook route, so register webhook route BEFORE express.json()
app.use("/api/webhook", webhookRoutes);  // webhook route using express.raw middleware internally

// For all other routes, use express.json()
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/subscription", subscriptionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
