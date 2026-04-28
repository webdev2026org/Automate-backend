import express from "express";
import { getProducts, createProducts } from "../controllers/product.controller.js";

const router = express.Router();

router.route("/products")
.get(getProducts)
.post(createProducts);

export default router;