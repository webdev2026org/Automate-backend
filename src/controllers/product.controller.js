import * as productService from "../services/product.service.js";

export const getProducts = async (req, res) => {
  try {
    const products = await productService.getProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// ✅ CREATE PRODUCT
export const createProducts = async (req, res) => {
  try {
    const {
      image,
      alt,
      category,
      title,
      price,
      subtitle,
      stockText,
      rating,
      note,
      brand
    } = req.body;

    // 🔴 Basic validation
    if (!title || !price) {
      return res.status(400).json({
        message: "Title and price are required",
      });
    }

    const product = await productService.createProducts({
      image,
      alt,
      category,
      title,
      price,
      subtitle,
      stockText,
      rating,
      note,
      brand
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Server error",
    });
  }
};