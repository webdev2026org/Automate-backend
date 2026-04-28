import express from "express";
import { createUser, getUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/user", createUser);
router.get("/users", getUsers);

export default router;