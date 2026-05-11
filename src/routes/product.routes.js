import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import {
  getProducts,
  createProducts,
  createBulkProducts,
  getProductById,
  updateProduct,
  bulkUpdateProducts,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router
  .route("/products")
  .get(getProducts)
  .post(authenticate, requirePermission("product:create"), createProducts);

router
  .route("/products/bulk")
  .post(authenticate, requirePermission("product:create"), createBulkProducts);

router.patch(
  "/products/bulk-update",
  authenticate,
  requirePermission("product:update"),
  bulkUpdateProducts,
);

// ✅ Keep :id routes AFTER /bulk to avoid conflict
router
  .route("/products/:id")
  .get(getProductById)
  .put(authenticate, requirePermission("product:update"), updateProduct)
  .delete(authenticate, requirePermission("product:delete"), deleteProduct);

export default router;
