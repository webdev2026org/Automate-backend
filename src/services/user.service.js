import User from "../models/user.model.js";

export const createUser = async (data) => {
  return await User.create(data);
};

export const getUsers = async () => {
  return await User.find();
};

export const getUserByUsername = async (username) => {
  return await User.findOne({
    username: { $regex: `^${username}$`, $options: "i" } // case-insensitive
  })
};

export const updateUserById = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, { returnDocument: 'after' });
};

export const deleteUserById = async (id) => {
  return await User.findByIdAndDelete(id);
};