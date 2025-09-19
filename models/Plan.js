import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
    productSlug: {
      type: String,
      required: true, // identifies which product this plan belongs to
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    durationDays: {
      type: Number,
      required: true,
    },
    features: {
      type: [String],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  }, { timestamps: true }
);

export default mongoose.model("Plan", planSchema);
