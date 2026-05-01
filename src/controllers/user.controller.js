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

    res.status(200).json({
      message: "Login successful",
      user: username,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
