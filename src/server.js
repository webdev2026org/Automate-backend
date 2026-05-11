import dotenv from "dotenv";
dotenv.config();

import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import app from "./app.js";
import connectDB from "./config/db.js";

console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET);

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});