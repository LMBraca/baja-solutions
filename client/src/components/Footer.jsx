import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#01376b] text-white py-5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Contact Information */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold mb-2">Contáctenos</h3>
            <p className="mb-2 text-sm">Teléfono: +52 (686) 405-5590</p>
            <p className="mb-2 text-sm">Correo: jrgguerra72@gmail.com</p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <ul>
              <li className="mb-2 text-sm">
                <Link to="/" className="hover:text-gray-300">
                  Inicio
                </Link>
              </li>
              <li className="mb-2 text-sm">
                <Link to="/about" className="hover:text-gray-300">
                  Nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="text-center md:text-right">
            <h3 className="text-xl font-semibold mb-2">Síguenos</h3>
            <div className="flex justify-center md:justify-end space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-3 pt-4 border-t border-gray-600">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} Baja Solutions. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
