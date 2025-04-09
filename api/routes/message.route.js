import express from "express";
import { sendPublicMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/send-public", sendPublicMessage);

export default router;
