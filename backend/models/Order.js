import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      name: String,
      price: Number,
      category: String
    }
  ],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered"],
    default: "Pending"
  }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);