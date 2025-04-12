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

    // Get all users
    const users = await User.find({});
    if (!users || users.length === 0) {
      return next(errorHandler(404, "No users found"));
    }

    // Set up email transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Create the listing URL
    const listingUrl = `${process.env.FRONTEND_URL}/listing/${listingId}`;

    // Send email to all users
    const emailPromises = users.map(async (user) => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `New inquiry about listing: ${listing.name}`,
        replyTo: email, // Allow the recipient to reply directly to the sender
        html: `
          <h2>You have a new inquiry about a listing</h2>
          <p><strong>Property:</strong> ${listing.name}</p>
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <h3>Message:</h3>
          <p>${message}</p>
          <p><strong>View the property:</strong> <a href="${listingUrl}">${
          listing.name
        }</a></p>
          <p>You can reply directly to this email to contact the interested party.</p>
        `,
      };

      return transporter.sendMail(mailOptions);
    });

    // Wait for all emails to be sent
    await Promise.all(emailPromises);

    // If phone number is provided, format a WhatsApp link for the listing owner
    const listingOwner = await User.findById(recipientId);

    res.status(200).json({
      success: true,
      message: "Message sent successfully to all users",
    });
  } catch (error) {
    console.error("Error sending message:", error);
    next(errorHandler(500, "Failed to send message: " + error.message));
  }
};

export const sendPropertySellRequest = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      propertyType,
      propertyLocation,
      message,
      recaptchaToken,
    } = req.body;

    if (!name || !email || !propertyLocation || !message) {
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

    // Get all admin users
    const users = await User.find({});
    if (!users || users.length === 0) {
      return next(errorHandler(404, "No users found"));
    }

    // Set up email transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send email to all users
    const emailPromises = users.map(async (user) => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Nueva solicitud para vender una propiedad: ${propertyType} en ${propertyLocation}`,
        replyTo: email, // Allow the recipient to reply directly to the sender
        html: `
          <h2>Solicitud de venta de propiedad</h2>
          <p><strong>Tipo de propiedad:</strong> ${propertyType}</p>
          <p><strong>Ubicación:</strong> ${propertyLocation}</p>
          <p><strong>De:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone || "No proporcionado"}</p>
          <h3>Mensaje:</h3>
          <p>${message}</p>
          <p>Puede responder directamente a este correo para contactar al interesado.</p>
        `,
      };

      return transporter.sendMail(mailOptions);
    });

    // Wait for all emails to be sent
    await Promise.all(emailPromises);

    res.status(200).json({
      success: true,
      message: "Solicitud de venta enviada con éxito",
    });
  } catch (error) {
    console.error("Error sending property sell request:", error);
    next(errorHandler(500, "Failed to send request: " + error.message));
  }
};
