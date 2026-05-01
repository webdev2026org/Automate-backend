import express from "express";
import {
    registerUser,
    loginUser,
    getUsers
} from "../controllers/user.controller.js";

const router = express.Router();

// ✅ Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ User data routes
router.get("/users", getUsers);

export default router;