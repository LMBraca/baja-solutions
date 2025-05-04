import express from "express";
import {
  signup,
  signin,
  signout,
  validateInvite,
  registerInvited,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", signout);
router.post("/validate-invite", validateInvite);
router.post("/register-invited", registerInvited);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
