import Product from "../models/product.model.js";

export const getProducts = async () => {
  return await Product.find();
};

// ✅ CREATE
export const createProducts = async (data) => {
  return await Product.create(data);
};