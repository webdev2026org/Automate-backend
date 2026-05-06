import Product from "../models/product.model.js";

export const getProducts = async (filter, options) => {
  const { page = 1, limit = 10, sort = {} } = options;

  // ✅ Ensure numbers
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;

  // ✅ Prevent negative values
  const safePage = pageNum < 1 ? 1 : pageNum;
  const safeLimit = limitNum < 1 ? 10 : limitNum;

  const skip = (safePage - 1) * safeLimit;

  // ✅ Run queries in parallel (faster 🚀)
  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(safeLimit),

    Product.countDocuments(filter),
  ]);

  return {
    products,
    total,
    page: safePage,
    limit: safeLimit,
  };
};

// ✅ CREATE
export const createProducts = async (data) => {
  return await Product.create(data);
};

export const createBulkProducts = async (products) => {
  return await Product.insertMany(products, { ordered: false });
};

// ✅ GET BY ID
export const getProductById = async (id) => {
  return await Product.findById(id);
};

// ✅ UPDATE
export const updateProduct = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, { new: true });
};

// ✅ DELETE
export const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};