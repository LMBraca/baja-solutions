import Category from "../models/category.js";
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing.js";

// Get all categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    next(errorHandler(500, "Failed to get categories: " + error.message));
  }
};

// Get a single category by ID
export const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return next(errorHandler(404, "Category not found"));
    }
    res.status(200).json(category);
  } catch (error) {
    next(errorHandler(500, "Failed to get category: " + error.message));
  }
};

// Create a new category
export const createCategory = async (req, res, next) => {
  try {
    if (!req.body.name) {
      return next(errorHandler(400, "Name is required"));
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({
      name: req.body.name,
    });

    if (existingCategory) {
      return next(errorHandler(400, "Category already exists"));
    }

    const newCategory = new Category({
      name: req.body.name,
      active: req.body.active !== undefined ? req.body.active : true,
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    next(errorHandler(500, "Failed to create category: " + error.message));
  }
};

// Update a category
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return next(errorHandler(404, "Category not found"));
    }

    if (req.body.name === "") {
      return next(errorHandler(400, "Name cannot be empty"));
    }

    // Check if updated category would duplicate an existing one
    if (req.body.name) {
      const duplicateCategory = await Category.findOne({
        name: req.body.name,
        _id: { $ne: req.params.id },
      });

      if (duplicateCategory) {
        return next(errorHandler(400, "Category already exists"));
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name || category.name,
          active:
            req.body.active !== undefined ? req.body.active : category.active,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedCategory);
  } catch (error) {
    next(errorHandler(500, "Failed to update category: " + error.message));
  }
};

// Delete a category
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return next(errorHandler(404, "Category not found"));
    }

    // Check if there are any listings using this category
    const listingsUsingCategory = await Listing.find({
      categoryRef: req.params.id,
    });
    if (listingsUsingCategory.length > 0) {
      return next(
        errorHandler(
          400,
          "No se puede eliminar la categoría porque hay publicaciones que la están usando"
        )
      );
    }

    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    next(errorHandler(500, "Failed to delete category: " + error.message));
  }
};
