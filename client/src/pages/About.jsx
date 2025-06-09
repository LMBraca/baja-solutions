import React, { useState, useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import PageTransition from "../components/PageTransition";
import gabrielaImage from "../assets/gabriela.jpeg";
import araceliImage from "../assets/araceli.jpeg";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaUsers } from "react-icons/fa";

const About = () => {
  const [loading, setLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    // Simulate content loading
    const timer = setTimeout(() => {
      setLoading(false);
      setContentReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {loading && <LoadingSpinner />}

      {!loading && (
        <PageTransition isLoading={!contentReady}>
          {/* Hero Section */}
          <section className="relative bg-gradient-to-r from-blue-600 to-cyan-500 py-20">
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Conozca a Baja Solutions
              </h1>
              <p className="text-xl text-white max-w-3xl mx-auto">
                Su socio confiable en bienes raíces en la región de Baja
                California
              </p>
            </div>
          </section>

          {/* Mission Section */}
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="w-full md:w-1/2">
                  <div className="bg-white p-8 rounded-xl shadow-lg">
                    <FaMapMarkerAlt className="text-blue-500 text-4xl mb-4" />
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                      Nuestra Misión
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Baja Solutions es una empresa inmobiliaria especializada
                      en vender y rentar propiedades en la región de Baja
                      California.
                    </p>
                    <p className="text-gray-600 mb-4">
                      Nuestro compromiso es brindar servicios inmobiliarios de
                      la más alta calidad, ayudando a nuestros clientes a
                      encontrar la propiedad perfecta que se ajuste a sus
                      necesidades y presupuesto.
                    </p>
                    <p className="text-gray-600">
                      Nos dedicamos a ofrecer un servicio personalizado y
                      profesional, garantizando la satisfacción de nuestros
                      clientes en cada transacción.
                    </p>
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <div className="bg-white p-8 rounded-xl shadow-lg">
                    <FaUsers className="text-blue-500 text-4xl mb-4" />
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                      Valores
                    </h2>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                        <p className="text-gray-600">
                          <span className="font-semibold">Integridad:</span>{" "}
                          Actuamos con honestidad y transparencia en cada
                          transacción.
                        </p>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                        <p className="text-gray-600">
                          <span className="font-semibold">Excelencia:</span> Nos
                          esforzamos por superar las expectativas de nuestros
                          clientes.
                        </p>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                        <p className="text-gray-600">
                          <span className="font-semibold">Compromiso:</span>{" "}
                          Dedicamos tiempo y esfuerzo para entender las
                          necesidades únicas de cada cliente.
                        </p>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                        <p className="text-gray-600">
                          <span className="font-semibold">
                            Profesionalismo:
                          </span>{" "}
                          Aplicamos nuestro conocimiento y experiencia para
                          ofrecer el mejor servicio.
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Nuestro Equipo de Expertos
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Contamos con consultores inmobiliarios altamente calificados,
                  listos para ayudarle a encontrar la propiedad de sus sueños o
                  vender su propiedad al mejor precio.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Araceli */}
                <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5">
                      <div className="h-full">
                        <img
                          src={araceliImage}
                          alt="Araceli Carrillo Perea"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="md:w-3/5 p-6">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        Araceli Carrillo Perea
                      </h3>
                      <p className="text-blue-600 font-medium mb-4">
                        Consultor Inmobiliario
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-700">
                          <FaEnvelope className="mr-3 text-blue-500" />
                          <a
                            href="mailto:aracelicarrillo@bajasolutions.org"
                            className="hover:text-blue-500 transition"
                          >
                            aracelicarrillo@bajasolutions.org
                          </a>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <FaPhone className="mr-3 text-blue-500" />
                          <a
                            href="tel:6861345891"
                            className="hover:text-blue-500 transition"
                          >
                            (686) 134-5891
                          </a>
                        </div>
                      </div>
                      <div className="mt-5 pt-5 border-t border-gray-200">
                        <p className="text-gray-600 italic">
                          "Mi compromiso es brindarle un servicio personalizado
                          y profesional para satisfacer sus necesidades
                          inmobiliarias."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Gabriela */}
                <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5">
                      <div className="h-full">
                        <img
                          src={gabrielaImage}
                          alt="Gabriela Brouwer Manzo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="md:w-3/5 p-6">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        Gabriela Brouwer Manzo
                      </h3>
                      <p className="text-blue-600 font-medium mb-4">
                        Consultor Inmobiliario
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-700">
                          <FaEnvelope className="mr-3 text-blue-500" />
                          <a
                            href="mailto:gabriela@bajasolutions.org"
                            className="hover:text-blue-500 transition"
                          >
                            gabriela@bajasolutions.org
                          </a>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <FaPhone className="mr-3 text-blue-500" />
                          <a
                            href="tel:6862331128"
                            className="hover:text-blue-500 transition"
                          >
                            (686) 233-1128
                          </a>
                        </div>
                      </div>
                      <div className="mt-5 pt-5 border-t border-gray-200">
                        <p className="text-gray-600 italic">
                          "Mi objetivo es encontrar la propiedad perfecta que se
                          ajuste a sus necesidades y presupuesto."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </PageTransition>
      )}
    </div>
  );
};

export default About;
