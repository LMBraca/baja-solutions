import User from "../models/user.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import Invitation from "../models/invitation.model.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashPassword = await bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashPassword });
  try {
    await newUser.save();
    res.status(201).json("User created successfully");
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });

    if (!validUser) return next(errorHandler(404, "Wrong email or password"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword)
      return next(errorHandler(401, "Wrong email or password"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(errorHandler(500, "Failed to sign in" + error.message));
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User logged out successfully");
  } catch (error) {
    next(errorHandler(500, "Failed to sign out" + error.message));
  }
};

export const validateInvite = async (req, res, next) => {
  const { token, email } = req.body;

  try {
    // Check if the invitation exists and is valid
    const invitation = await Invitation.findOne({
      email,
      token,
      expiresAt: { $gt: Date.now() },
    });

    if (!invitation) {
      return next(errorHandler(400, "Invalid or expired invitation"));
    }

    // Validate token and email
    res.status(200).json({ success: true });
  } catch (error) {
    next(errorHandler(500, "Failed to validate invitation: " + error.message));
  }
};

export const registerInvited = async (req, res, next) => {
  const { username, email, password, phoneNumber, token } = req.body;

  try {
    // Validate the invitation token again
    const invitation = await Invitation.findOne({
      email,
      token,
      expiresAt: { $gt: Date.now() },
    });

    if (!invitation) {
      return next(errorHandler(400, "Invalid or expired invitation"));
    }

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(400, "User with this email already exists"));
    }

    // Validate phone number
    if (!phoneNumber) {
      return next(errorHandler(400, "Phone number is required"));
    }

    // Create the new user with phone number
    const hashPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashPassword,
      phoneNumber,
    });
    await newUser.save();

    // Delete the invitation once it's been used
    await Invitation.findByIdAndDelete(invitation._id);

    // Automatically sign in the new user
    const jwtToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = newUser._doc;

    res
      .cookie("access_token", jwtToken, { httpOnly: true })
      .status(201)
      .json(rest);
  } catch (error) {
    console.error("Registration error:", error);
    next(errorHandler(500, "Failed to register user: " + error.message));
  }
};
