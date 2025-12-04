import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export const createUser = (user) =>
  model.create({
    ...user,
    _id: user._id || uuidv4(),
  });

export const findAllUsers = () => model.find();

export const findUserById = (userId) => model.findById(userId);

export const findUserByUsername = (username) =>
  model.findOne({ username });

export const findUserByCredentials = (username, password) =>
  model.findOne({ username, password });

export const updateUser = (userId, userUpdates) =>
  model.updateOne({ _id: userId }, { $set: userUpdates });

export const deleteUser = (userId) => model.deleteOne({ _id: userId });
