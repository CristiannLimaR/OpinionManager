import { request, response } from "express";
import Category from "./category.model.js";
import User from "../user/user.model.js";


export const getCategories = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const [total, categories] = await Promise.all([
      Category.countDocuments({ state: true }),
      Category.find({ state: true }).skip(Number(offset)).limit(Number(limit)),
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

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const categorie = await Category.findById(id);

    if (!categorie) {
      return res.status(404).json({
        success: false,
        msg: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      categorie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "error searching category",
      error: error.message,
    });
  }
};

export const saveCategory = async (req, res) => {
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

    const category = new Category({
      ...data,
    });
    await category.save();

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error saving Category",
      error,
    });
  }
};

export const updateCategory = async (req, res) => {
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
    const categorie = await Category.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.status(200).json({
      success: true,
      msg: "category successfully updated",
      categorie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "error updating category",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
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
    const categorie = await Category.findByIdAndUpdate(id, { state: false });
    res.status(200).json({
      success: true,
      msg: "category successfully removed",
      categorie
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "error deleting category",
      error: error.message,
    });
  }
};
