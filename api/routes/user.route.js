import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import {
  updateUser,
  deleteUser,
  getUserListings,
  inviteUser,
  getUser,
  getUsers,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/update/:id", verifyUser, updateUser);
router.delete("/delete/:id", verifyUser, deleteUser);
router.get("/listings/:id", verifyUser, getUserListings);
router.post("/invite", verifyUser, inviteUser);
router.get("/:id", verifyUser, getUser);
router.get("/", verifyUser, getUsers);

export default router;
