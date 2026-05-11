import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import {
    registerUser,
    loginUser,
    getUsers,
    updateUserRole,
    deleteUser 
} from "../controllers/user.controller.js";

const router = express.Router();

// ✅ Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// User data routes — admin only
router.get("/users", getUsers);
router.patch("/users/:id/role", authenticate, requirePermission("user:update"), updateUserRole);
router.delete("/users/:id", authenticate, requirePermission("user:delete"), deleteUser);

export default router;