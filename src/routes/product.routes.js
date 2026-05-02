import express from "express";
import { getProducts, createProducts, createBulkProducts } from "../controllers/product.controller.js";

const router = express.Router();

router.route("/products")
.get(getProducts)
.post(createProducts);

router.route("/products/bulk")
  .post(createBulkProducts);

export default router;