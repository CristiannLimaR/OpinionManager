import { request, response } from "express";
import Categorie from "./categorie.model.js";
import User from "../user/user.model.js";


export const getCategories = async (req = request, res = response) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const [total, categories] = await Promise.all([
      Categorie.countDocuments({ state: true }),
      Categorie.find({ state: true }).skip(Number()).limit(Number(limit)),
    ]);

    res.status(200).json({
      success: true,
      total,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "error getting categories",
      error: error.message,
    });
  }
};

export const getCategorieById = async (req, res) => {
  try {
    const { id } = req.params;
    const categorie = await Categorie.findById(id);

    if (!categorie) {
      return res.status(404).json({
        success: false,
        msg: "Categorie not found",
      });
    }

    res.status(200).json({
      success: true,
      categorie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "error searching categorie",
      error: error.message,
    });
  }
};

export const saveCategorie = async (req, res) => {
  try {
    const data = req.body;
    const authenticatedUser = req.user;
    const adminUser = await User.findOne({ username: "admin" });
    if (authenticatedUser.id !== adminUser.id) {
      return res.status(401).json({
        success: false,
        msg: "Only the admin can create new categories"
      });
    }

    const categorie = new Categorie({
      ...data,
    });
    await categorie.save();

    res.status(200).json({
      success: true,
      categorie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error saving Categorie",
      error,
    });
  }
};

export const updateCategorie = async (req, res) => {
  try {
    const { id } = req.params;
    const { ...data } = req.body;
    const authenticatedUser = req.user;

    const adminUser = await User.findOne({ username: "admin" });

    if (authenticatedUser.id !== adminUser.id) {
      return res.status(401).json({
        success: false,
        msg: "Only de admin can update categories",
      });
    }
    const categorie = await Categorie.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.status(200).json({
      success: true,
      msg: "categorie successfully updated",
      categorie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "error updating categorie",
      error: error.message,
    });
  }
};

export const deleteCategorie = async (req, res) => {
  try {
    const { id } = req.params;
    const authenticatedUser = req.user;

    const adminUser = await User.findOne({ username: "admin" });
    
    if (authenticatedUser.id !== adminUser.id) {
      return res.status(401).json({
        success: false,
        msg: "Only de admin can delete categories",
      });
    }
    const categorie = await Categorie.findByIdAndUpdate(id, { state: false });
    res.status(200).json({
      success: true,
      msg: "categorie successfully removed",
      categorie
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "error deleting categorie",
      error: error.message,
    });
  }
};
