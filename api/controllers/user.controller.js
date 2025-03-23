import User from "../models/user.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import dotenv from "dotenv";
import Listing from "../models/listing.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import Invitation from "../models/invitation.model.js";
dotenv.config();

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "Unauthorized"));

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    // Validate phone number if provided
    if (req.body.phoneNumber && !req.body.phoneNumber.includes(" ")) {
      return next(errorHandler(400, "Phone number must include area code"));
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          phoneNumber: req.body.phoneNumber,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(errorHandler(500, "Failed to update user" + error.message));
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "Unauthorized"));

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User deleted successfully");
  } catch (error) {
    next(errorHandler(500, "Failed to delete user" + error.message));
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "Unauthorized"));

  try {
    const listings = await Listing.find({ userRef: req.params.id });
    res.status(200).json(listings);
  } catch (error) {
    next(errorHandler(500, "Failed to get user listings" + error.message));
  }
};

export const inviteUser = async (req, res, next) => {
  const { email, adminName, adminEmail } = req.body;

  try {
    // Check for missing required fields
    if (!email || !adminName || !adminEmail) {
      return next(errorHandler(400, "Missing required fields"));
    }

    // Check if email already exists in the system
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(400, "User with this email already exists"));
    }

    // Generate a unique invitation token
    const inviteToken = crypto.randomBytes(32).toString("hex");
    const inviteExpiry = Date.now() + 3600000; // 1 hour expiry

    // Store the invitation in the database
    const invitation = new Invitation({
      email,
      token: inviteToken,
      expiresAt: new Date(inviteExpiry),
      invitedBy: req.user.id,
    });
    await invitation.save();

    // Create invite URL
    const inviteUrl = `${
      process.env.FRONTEND_URL
    }/admin/register?token=${inviteToken}&email=${encodeURIComponent(email)}`;

    // Set up email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "noreplybajasolutions@gmail.com",
        pass: process.env.EMAIL_PASSWORD, // Make sure to set this in your .env file
      },
    });

    // Email content
    const mailOptions = {
      from: "noreplybajasolutions@gmail.com",
      replyTo: adminEmail,
      to: email,
      subject: "Invitation to Baja Solutions Admin Panel",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Baja Solutions Invitation</title>
          <style type="text/css">
            @media only screen and (max-width: 480px) {
              .button {
                width: 100% !important;
                text-align: center !important;
              }
            }
          </style>
        </head>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
            <tr>
              <td style="padding: 30px;">
                <h2 style="color: #333333; margin-top: 0;">Baja Solutions Admin Panel Invitation</h2>
                <p style="color: #555555; line-height: 22px;">Hello,</p>
                <p style="color: #555555; line-height: 22px;">You have been invited by ${adminName} (${adminEmail}) to join the Baja Solutions admin panel.</p>
                <p style="color: #555555; line-height: 22px;">Click the button below to create your account:</p>
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0;">
                  <tr>
                    <td>
                      <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                        <tr>
                          <td align="center" bgcolor="#3c4858" class="button" style="border-radius: 4px; padding: 0;">
                            <a href="${inviteUrl}" target="_blank" style="border: none; color: white; padding: 15px 25px; text-decoration: none; display: inline-block; font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                              Accept Invitation
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <p style="color: #555555; line-height: 22px;">If the button doesn't work, copy and paste this URL into your browser:</p>
                <p style="color: #555555; line-height: 22px; word-break: break-all;"><a href="${inviteUrl}" style="color: #3c4858;">${inviteUrl}</a></p>
                <p style="color: #555555; line-height: 22px;">This invitation will expire in 1 hour.</p>
                <p style="color: #555555; line-height: 22px;">If you have any questions, you can reply directly to this email to contact ${adminName}.</p>
                <p style="color: #555555; line-height: 22px; margin-bottom: 0;">Best regards,<br>Baja Solutions Team</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // After sending email, add extra logging
    console.log("Invitation sent successfully to:", email);

    res
      .status(200)
      .json({ success: true, message: "Invitation sent successfully" });
  } catch (error) {
    console.error("Invitation error:", error);
    next(errorHandler(500, "Failed to send invitation: " + error.message));
  }
};
