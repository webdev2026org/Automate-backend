import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", productRoutes);

export default app;