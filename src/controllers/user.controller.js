import * as userService from "../services/user.service.js";

export const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

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
