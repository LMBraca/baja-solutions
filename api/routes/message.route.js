import express from "express";
import {
  sendPublicMessage,
  sendPropertySellRequest,
} from "../controllers/message.controller.js";

const router = express.Router();

router.post("/send-public", sendPublicMessage);
router.post("/sell-property", sendPropertySellRequest);

export default router;
