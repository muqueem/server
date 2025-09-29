import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  planName: {
    type: String
  }, // e.g. "Lifetime Plan" or "Annual Plan"
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  lifetime: {
    type: Boolean,
    default: true
  },
  supportEndDate: {
    type: Date,
    required: true
  }, // 3 months after purchase
  isActive: {
    type: Boolean,
    default: true
  },
  successToken: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model("Subscription", subscriptionSchema);
