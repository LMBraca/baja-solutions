import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import logo from "../assets/logo.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-800 text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Company Info */}
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center mb-4">
              <img src={logo} alt="Baja Solutions Logo" className="w-8 h-8" />
              <div className="flex flex-col ml-2">
                <span className="text-white font-bold text-lg">
                  BAJA SOLUTIONS
                </span>
                <span className="text-white text-xs tracking-wider">
                  REAL ESTATE
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-300 max-w-xs">
              Baja Solutions ofrece servicios inmobiliarios de alta calidad en
              la región de Baja California.
            </p>
          </div>

          {/* Quick Links */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="text-sm space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Acerca de
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Propiedades
                </Link>
              </li>
              <li>
                <Link
                  to="/sell"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Vender Propiedad
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="text-sm space-y-2">
              <li className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-gray-400" />
                <span className="text-gray-300">
                  Cabo San Lucas, Baja California Sur
                </span>
              </li>
              <li className="flex items-center gap-2">
                <FaPhone className="text-gray-400" />
                <a
                  href="tel:+526241234567"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  +52 624 123 4567
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-gray-400" />
                <a
                  href="mailto:info@bajasolutions.com"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  info@bajasolutions.com
                </a>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-4 flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaTwitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center md:text-left text-sm text-gray-400">
          <p>
            © {currentYear} Baja Solutions Real Estate. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
