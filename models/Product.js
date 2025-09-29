import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    slug: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: String,
    features: [String],
    legal: String,
    backtesting: String,
    image: String,
    gallery: [String],
    popular: {
        type: Boolean,
        default: false,
    },
    plans: [
        {
            name: {
                type: String,
                required: true,
                default: "Lifetime Plan"
            },
            price: {
                type: Number,
                required: true
            },
            currency: {
                type: String,
                default: "USD"
            },
            duration: {
                type: String,
                default: "Lifetime"
            },
            features: {
                type: [String],
                default: []
            },
        },
    ],
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
