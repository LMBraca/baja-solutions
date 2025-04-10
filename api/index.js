import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserRoutes from "./routes/user.route.js";
import AuthRoutes from "./routes/auth.route.js";
import ListingRoutes from "./routes/listing.route.js";
import MessageRoutes from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import "./models/invitation.model.js";

dotenv.config();

mongoose.connect(process.env.MONGO);

const app = express();
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/api/user", UserRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/listing", ListingRoutes);
app.use("/api/messages", MessageRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
