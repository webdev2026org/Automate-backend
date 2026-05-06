import express from "express";
import {
  getProducts,
  createProducts,
  createBulkProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.route("/products")
  .get(getProducts)
  .post(createProducts);

router.route("/products/bulk")
  .post(createBulkProducts);

// ✅ Keep :id routes AFTER /bulk to avoid conflict
router.route("/products/:id")
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

export default router;