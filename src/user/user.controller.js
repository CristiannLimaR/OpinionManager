import { response, request } from "express";
import { hash, verify } from "argon2";
import User from "./user.model.js";

export const getUsers = async (req = request, res = response) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const query = { state: true };

    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query).skip(Number(offset)).limit(Number(limit)),
    ]);

    res.status(200).json({
      success: true,
      total,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "error when searching for users",
      error: error.message,
    });
  }
};

export const getUserById = async (req = request, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "User not found",
      });
    }

    res.status(200).json({
      succes: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "error when searching for user",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { oldPassword, password, ...data } = req.body;
    const authenticatedUser = req.user;

    if (authenticatedUser.id !== id) {
      return res.status(403).json({
        success: false,
        msg: "You can only update your own account",
      });
    }
    if (password) {
      if (!oldPassword) {
        return res.status(400).json({
          success: false,
          msg: "Old password is required to change password",
        });
      } else {
        const validPassword = await verify(
          authenticatedUser.password,
          oldPassword
        );
        if (!validPassword) {
          return res.status(400).json({
            success: false,
            msg: "Old password is incorrect",
          });
        }

        data.password = await hash(password);
      }
    }

    const user = await User.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
      success: true,
      msg: "User successfully updated",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error updating user",
      error: error.message,
    });
  }
};
