import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAdmin from "../middlewares/isAdmin.js";
import {
  createSweet,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
} from "../controllers/sweet.controller.js";

const router = express.Router();

// Create sweet (ADMIN)
router.post("/create", isAuthenticated, isAdmin, createSweet);

// Get all sweets
router.get("/get-all-sweets", getAllSweets);

// Search sweets
router.get("/search", searchSweets);

// Update sweet (ADMIN)
router.put("/:id", isAuthenticated, isAdmin, updateSweet);

// Delete sweet (ADMIN)
router.delete("/:id", isAuthenticated, isAdmin, deleteSweet);

// Purchase sweet (USER)
router.post("/:id/purchase", isAuthenticated, purchaseSweet);

// Restock sweet (ADMIN)
router.post("/:id/restock", isAuthenticated, isAdmin, restockSweet);

export default router;
