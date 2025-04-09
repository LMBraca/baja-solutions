import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
  getListingUser,
} from "../controllers/listing.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyUser, createListing);
router.delete("/delete/:id", verifyUser, deleteListing);
router.post("/update/:id", verifyUser, updateListing);
router.get("/:id", getListing);
router.get("/user/:id", getListingUser);
router.get("/", getListings);
export default router;
