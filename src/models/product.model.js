import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    image: String,
    alt: String,
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number, // ✅ FIXED (critical)
      required: true,
    },
    subtitle: String,
    stockText: String,
    rating: {
      type: Number,
      default: 0,
    },
    brand: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;