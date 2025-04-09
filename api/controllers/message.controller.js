import User from "../models/user.js";
import Listing from "../models/listing.js";
import { errorHandler } from "../utils/error.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// Function to verify reCAPTCHA token
const verifyRecaptcha = async (token) => {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
    );

    return response.data.success;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
};

export const sendPublicMessage = async (req, res, next) => {
  try {
    const {
      listingId,
      recipientId,
      name,
      email,
      phone,
      message,
      recaptchaToken,
    } = req.body;

    if (!listingId || !recipientId || !name || !email || !message) {
      return next(errorHandler(400, "Missing required fields"));
    }

    // Verify reCAPTCHA token
    if (!recaptchaToken) {
      return next(errorHandler(400, "reCAPTCHA verification failed"));
    }

    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      return next(errorHandler(400, "reCAPTCHA verification failed"));
    }

    // Verify that the listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    // Verify that the recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return next(errorHandler(404, "Recipient not found"));
    }

    // Send email to the listor
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipient.email,
      subject: `New inquiry about your listing: ${listing.name}`,
      replyTo: email, // Allow the recipient to reply directly to the sender
      html: `
        <h2>You have a new inquiry about your listing</h2>
        <p><strong>Property:</strong> ${listing.name}</p>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <h3>Message:</h3>
        <p>${message}</p>
        <p>You can reply directly to this email to contact the interested party.</p>
      `,
    };

    console.log("Sending email to:", recipient.email);
    console.log("Using email service:", process.env.EMAIL_SERVICE);
    console.log("Using email user:", process.env.EMAIL_USER);

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");

    // If phone number is provided, format a WhatsApp link
    if (recipient.phoneNumber) {
      // Format the WhatsApp message
      const whatsappMessage = `*New inquiry about your listing: ${
        listing.name
      }*\n\nFrom: ${name}\nEmail: ${email}\nPhone: ${
        phone || "Not provided"
      }\n\nMessage:\n${message}`;

      // Encode the message for URL
      const encodedMessage = encodeURIComponent(whatsappMessage);

      // Format the phone number (remove any non-digit characters and ensure it starts with country code)
      let formattedPhone = recipient.phoneNumber.replace(/\D/g, "");
      if (!formattedPhone.startsWith("52")) {
        formattedPhone = "52" + formattedPhone;
      }

      // Create the WhatsApp API URL
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`;

      // Here you would typically use a WhatsApp Business API to send the message
      // For now, we'll just indicate it was prepared for sending
      console.log(
        `WhatsApp message prepared for ${recipient.phoneNumber}: ${whatsappUrl}`
      );
    }

    res
      .status(200)
      .json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    next(errorHandler(500, "Failed to send message: " + error.message));
  }
};
