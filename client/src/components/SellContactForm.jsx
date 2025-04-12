import { useState, useRef } from "react";
import { FaWhatsapp } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";

export default function SellContactForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const recaptchaRef = useRef();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    propertyType: "casa", // Default value
    propertyLocation: "",
    message: "",
  });

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

    if (
      !formData.name ||
      !formData.email ||
      !formData.message ||
      !formData.propertyLocation
    ) {
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

      const res = await fetch("/api/messages/sell-property", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          propertyType: formData.propertyType,
          propertyLocation: formData.propertyLocation,
          message: formData.message,
          recaptchaToken: captchaValue,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message ||
            `Error ${res.status}: Hubo un problema al enviar el formulario`
        );
      }

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
        propertyType: "casa",
        propertyLocation: "",
        message: "",
      });

      // Reset reCAPTCHA
      recaptchaRef.current.reset();
      setCaptchaValue(null);

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error) {
      setLoading(false);
      console.error("Form submission error:", error);

      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        setError(
          "Error de conexión: No se pudo contactar al servidor. Por favor, verifique su conexión a internet e inténtelo de nuevo."
        );
      } else {
        setError(
          error.message ||
            "Error al enviar el mensaje. Por favor, verifique su conexión e inténtelo de nuevo."
        );
      }

      // Reset reCAPTCHA
      recaptchaRef.current.reset();
      setCaptchaValue(null);
    }
  };

  // Create WhatsApp URL
  const getWhatsAppUrl = () => {
    const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
    const defaultMessage = `Hola, me gustaría obtener información sobre vender mi propiedad.`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      defaultMessage
    )}`;
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md w-full">
      <h2 className="text-2xl font-semibold mb-4">
        Contáctanos para vender tu propiedad
      </h2>

      {error && (
        <div className="p-2 bg-red-100 text-red-800 rounded-md mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="p-2 bg-green-100 text-green-800 rounded-md mb-4">
          ¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto
          para ayudarte a vender tu propiedad.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre completo*
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

          <div>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Teléfono*
            </label>
            <input
              type="tel"
              id="phone"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Incluya su teléfono para una respuesta más rápida"
            />
          </div>

          <div>
            <label
              htmlFor="propertyType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tipo de propiedad*
            </label>
            <select
              id="propertyType"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={formData.propertyType}
              onChange={handleChange}
              required
            >
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="terreno">Terreno</option>
              <option value="local">Local comercial</option>
              <option value="oficina">Oficina</option>
              <option value="otro">Otro</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="propertyLocation"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Ubicación de la propiedad*
          </label>
          <input
            type="text"
            id="propertyLocation"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={formData.propertyLocation}
            onChange={handleChange}
            required
            placeholder="Ciudad, Estado, Colonia, etc."
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Información adicional*
          </label>
          <textarea
            id="message"
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Describe brevemente tu propiedad (tamaño, características, precio aproximado, etc.)"
          ></textarea>
        </div>

        <div className="flex justify-center items-center w-full transform">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={handleCaptchaChange}
          />
        </div>

        <p className="text-xs text-gray-500">
          *Campos requeridos. Tu información será tratada confidencialmente.
        </p>

        <button
          type="submit"
          className="w-full bg-[#00386b] text-white py-3 px-4 rounded-md hover:bg-[#002d56] transition duration-200 text-lg font-medium"
          disabled={loading || !captchaValue}
        >
          {loading ? "Enviando..." : "Solicitar asesoría para vender"}
        </button>
      </form>

      {/* WhatsApp Button */}
      <div className="mt-6 text-center">
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
    </div>
  );
}
