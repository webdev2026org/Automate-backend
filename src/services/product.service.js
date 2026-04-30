import Product from "../models/product.model.js";

export const getProducts = async (filter, options) => {
  const { page = 1, limit = 10, sort = {} } = options;

  const skip = (page - 1) * limit;

  const products = await Product.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  return products;
};

// ✅ CREATE
export const createProducts = async (data) => {
  return await Product.create(data);
};