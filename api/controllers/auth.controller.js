import User from "../models/user.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import Invitation from "../models/invitation.model.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

export const signup = async (req, res, next) => {
  const { username, email, password, phoneNumber } = req.body;
  const hashPassword = await bcryptjs.hashSync(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashPassword,
    phoneNumber,
  });
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

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(errorHandler(404, "User with this email doesn't exist"));
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Set token expiry (1 hour)
    const resetTokenExpiry = Date.now() + 3600000;

    // Save the reset token and expiry to the user document
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h1>You requested a password reset</h1>
        <p>Click this link to reset your password:</p>
        <a href="${resetUrl}" target="_blank">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({
        success: true,
        message: "Password reset email sent successfully",
      });
  } catch (error) {
    next(
      errorHandler(
        500,
        "Failed to process forgot password request: " + error.message
      )
    );
  }
};

export const resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;

  try {
    // Find user by reset token and check if token is still valid
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return next(errorHandler(400, "Invalid or expired reset token"));
    }

    // Hash the new password
    const hashPassword = bcryptjs.hashSync(newPassword, 10);

    // Update user's password and clear reset token fields
    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password has been reset successfully" });
  } catch (error) {
    next(errorHandler(500, "Failed to reset password: " + error.message));
  }
};
