import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

// If you are using ES modules, you'll need the __dirname workaround:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import your routes
import UserRoutes from "./routes/user.route.js";
import AuthRoutes from "./routes/auth.route.js";
import ListingRoutes from "./routes/listing.route.js";
import MessageRoutes from "./routes/message.route.js";
import CityRoutes from "./routes/city.route.js";
import CategoryRoutes from "./routes/category.route.js";

import "./models/invitation.model.js";

dotenv.config();
mongoose.connect(process.env.MONGO);

const app = express();

app.use(express.json());
app.use(cookieParser());

// Example API routes
app.use("/api/user", UserRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/listing", ListingRoutes);
app.use("/api/messages", MessageRoutes);
app.use("/api/cities", CityRoutes);
app.use("/api/categories", CategoryRoutes);

// 1) Serve your built React files from the client/dist folder
app.use(express.static(path.join(__dirname, "../client/dist")));

// 2) For any route that doesn't match /api, serve index.html so React can handle routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Custom error handler (if you need it)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// IMPORTANT: Use process.env.PORT, especially on Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
