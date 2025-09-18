import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import {
  getUsers,
  getUserById,
  deleteUser
} from "../controllers/userController.js";

const router = express.Router();

// User Management Routes
router.get("/", protect, adminOnly, getUsers); // Get all users (Admin only)
router.get("/:id", protect, getUserById); // Get a specific user by id
router.delete("/:id", protect, adminOnly, deleteUser) // Delete user (Admin Only)


export default router;