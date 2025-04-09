import { useState, useEffect, useRef } from "react";
import { FaWhatsapp } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";

export default function ContactForm({ listingId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [listingOwner, setListingOwner] = useState(null);
  const [captchaValue, setCaptchaValue] = useState(null);
  const recaptchaRef = useRef();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    const fetchListingOwner = async () => {
      try {
        const res = await fetch(`/api/listing/user/${listingId}`);
        const data = await res.json();

        if (data.success === false) {
          setError(data.message);
          return;
        }

        setListingOwner(data);
      } catch (error) {
        setError("Failed to fetch listing owner information");
      }
    };

    fetchListingOwner();
  }, [listingId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill out all required fields");
      return;
    }

    if (!captchaValue) {
      setError("Please complete the captcha");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/messages/send-public", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId,
          recipientId: listingOwner._id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          recaptchaToken: captchaValue,
        }),
      });

      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        // Reset reCAPTCHA
        recaptchaRef.current.reset();
        setCaptchaValue(null);
        return;
      }

      setLoading(false);
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      // Reset reCAPTCHA
      recaptchaRef.current.reset();
      setCaptchaValue(null);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      setLoading(false);
      setError("Failed to send message");
      // Reset reCAPTCHA
      recaptchaRef.current.reset();
      setCaptchaValue(null);
    }
  };

  // Create WhatsApp URL
  const getWhatsAppUrl = () => {
    if (!listingOwner || !listingOwner.phoneNumber) return null;

    // Format the phone number (remove any non-digit characters and ensure it starts with country code)
    let formattedPhone = listingOwner.phoneNumber.replace(/\D/g, "");
    if (!formattedPhone.startsWith("52")) {
      formattedPhone = "52" + formattedPhone;
    }

    // Create default message
    const defaultMessage = `Hello, I'm interested in your listing.`;

    // Return the WhatsApp URL
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
      defaultMessage
    )}`;
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h2 className="text-2xl font-semibold mb-4">
        Contact {listingOwner?.username}
      </h2>

      {error && (
        <div className="p-2 bg-red-100 text-red-800 rounded-md mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="p-2 bg-green-100 text-green-800 rounded-md mb-4">
          Message sent successfully! The property owner will contact you
          shortly.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Name*
          </label>
          <input
            type="text"
            id="name"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Email*
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Phone
          </label>
          <input
            type="tel"
            id="phone"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Include your phone for faster response"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Message*
          </label>
          <textarea
            id="message"
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="I'm interested in this property. Please contact me with more information."
          ></textarea>
        </div>

        <div className="mb-4 flex justify-center">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6LcB7hArAAAAAI0QOVzmJwkruCdsXnhc6yPT647t" 
            onChange={handleCaptchaChange}
          />
        </div>

        <p className="text-xs text-gray-500 mb-3">
          *Required fields. Your information will be sent directly to the
          property owner.
        </p>

        <button
          type="submit"
          className="w-full bg-[#00386b] text-white py-2 px-4 rounded-md hover:bg-[#002d56] transition duration-200"
          disabled={loading || !captchaValue}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>

      {/* WhatsApp Button */}
      {listingOwner?.phoneNumber && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 mb-2">Or contact directly via:</p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition duration-200"
          >
            <FaWhatsapp size={24} />
            <span>Contact via WhatsApp</span>
          </a>
        </div>
      )}
    </div>
  );
}
