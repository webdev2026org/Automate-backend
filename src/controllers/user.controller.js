import jwt from "jsonwebtoken";
import * as userService from "../services/user.service.js";

export const getUsers = async (req, res) => {
  try {
    const { username } = req.query;

    if (username) {
      const user = await userService.getUserByUsername(username);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    }

    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await userService.getUserByUsername(username);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await userService.createUser({ username, email, password });

    res.status(201).json({
      message: "User created successfully",
      user: username,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userService.getUserByUsername(username);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "Login successful",
      user: username,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ["user", "admin", "guest"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const updated = await userService.updateUserById(id, { role });
    res.status(200).json({ message: "Role updated", user: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userService.deleteUserById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};