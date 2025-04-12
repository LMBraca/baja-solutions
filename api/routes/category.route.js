import express from "express";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

// Get all categories (public access)
router.get("/", getCategories);

// Get a single category (public access)
router.get("/:id", getCategory);

// Create, update, and delete operations
router.post("/create", createCategory);
router.put("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);

export default router;
