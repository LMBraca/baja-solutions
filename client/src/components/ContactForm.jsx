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
        setError("Error al obtener información del propietario");
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
      setError("Por favor complete todos los campos requeridos");
      return;
    }

    if (!captchaValue) {
      setError("Por favor complete la verificación de captcha");
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
        setError(
          data.message ||
            "Error al enviar el mensaje. Por favor, inténtelo de nuevo."
        );
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
      setError(
        "Error al enviar el mensaje. Por favor, verifique su conexión e inténtelo de nuevo."
      );
      // Reset reCAPTCHA
      recaptchaRef.current.reset();
      setCaptchaValue(null);
    }
  };

  const getWhatsAppUrl = () => {
    if (!listingOwner?.phoneNumber) {
      return null;
    }

    let formattedPhone = listingOwner.phoneNumber.replace(/\D/g, "");
    if (!formattedPhone.startsWith("52")) {
      formattedPhone = "52" + formattedPhone;
    }

    const defaultMessage = `Hola, estoy interesado en tu propiedad.`;

    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
      defaultMessage
    )}`;
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md w-full min-w-[300px] max-w-[450px]">
      <h2 className="text-2xl font-semibold mb-4">Contáctanos</h2>

      {error && (
        <div className="p-2 bg-red-100 text-red-800 rounded-md mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="p-2 bg-green-100 text-green-800 rounded-md mb-4">
          ¡Mensaje enviado con éxito! El propietario se pondrá en contacto
          contigo pronto.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre*
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
            Correo Electrónico*
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
            Teléfono
          </label>
          <input
            type="tel"
            id="phone"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Incluya su teléfono para una respuesta más rápida"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Mensaje*
          </label>
          <textarea
            id="message"
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Estoy interesado en esta propiedad. Por favor, contáctame con más información."
          ></textarea>
        </div>

        <div className="mb-4">
          <div className="flex justify-center items-center w-full transform scale-[0.85]">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={handleCaptchaChange}
            />
          </div>
        </div>

        <p className="text-xs text-gray-500 mb-3">
          *Campos requeridos. Tu información será enviada directamente al
          propietario de la propiedad.
        </p>

        <button
          type="submit"
          className="w-full bg-[#00386b] text-white py-2 px-4 rounded-md hover:bg-[#002d56] transition duration-200"
          disabled={loading || !captchaValue}
        >
          {loading ? "Enviando..." : "Enviar Mensaje"}
        </button>
      </form>

      {/* WhatsApp Button */}
      {listingOwner?.phoneNumber && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 mb-2">
            O contáctenos directamente por:
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition duration-200"
          >
            <FaWhatsapp size={24} />
            <span>Chatear por WhatsApp</span>
          </a>
        </div>
      )}
    </div>
  );
}
