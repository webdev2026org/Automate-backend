import express from "express";
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

// ✅ User data routes
router.get("/users", getUsers);

//✅ User roles update
router.patch("/users/:id/role", updateUserRole);

// deleteUser
router.delete("/users/:id", deleteUser);

export default router;