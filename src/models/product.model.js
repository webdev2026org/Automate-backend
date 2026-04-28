import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  image: String,
  alt: String,
  category: String,
  title: String,
  price: String,
  subtitle: String,
  stockText: String,
  rating: Number,
  note: String,
  brand: String,
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;