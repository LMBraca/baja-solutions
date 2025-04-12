import React, { useState, useEffect } from "react";
import PageTransition from "../components/PageTransition";
import LoadingSpinner from "../components/LoadingSpinner";
import SellContactForm from "../components/SellContactForm";
import {
  FaHome,
  FaClipboardCheck,
  FaHandshake,
  FaChartLine,
  FaUsers,
  FaGlobe,
} from "react-icons/fa";
import brokerDealImg from "../assets/brokerdeal.jpg";

export default function Sell() {
  const [pageLoading, setPageLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
      setContentReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const benefits = [
    {
      icon: <FaClipboardCheck className="text-4xl text-blue-600" />,
      title: "Asesoría Profesional",
      description:
        "Evaluamos tu propiedad y te ofrecemos estrategias personalizadas para maximizar su valor.",
    },
    {
      icon: <FaHome className="text-4xl text-blue-600" />,
      title: "Promoción Efectiva",
      description:
        "Posicionamos tu propiedad en los canales más efectivos para atraer compradores calificados.",
    },
    {
      icon: <FaHandshake className="text-4xl text-blue-600" />,
      title: "Negociación Experta",
      description:
        "Defendemos tus intereses y buscamos las mejores condiciones para tu venta o renta.",
    },
    {
      icon: <FaChartLine className="text-4xl text-blue-600" />,
      title: "Análisis de Mercado",
      description:
        "Utilizamos datos actualizados para determinar el precio óptimo de tu propiedad.",
    },
    {
      icon: <FaUsers className="text-4xl text-blue-600" />,
      title: "Servicio Personalizado",
      description:
        "Te acompañamos en cada paso del proceso, resolviendo dudas y anticipando necesidades.",
    },
    {
      icon: <FaGlobe className="text-4xl text-blue-600" />,
      title: "Red Internacional",
      description:
        "Formamos parte de una red global que amplía las posibilidades de venta de tu propiedad.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Evaluación",
      description:
        "Analizamos tu propiedad y determinamos su valor comercial en el mercado.",
    },
    {
      number: "02",
      title: "Preparación",
      description:
        "Preparamos tu propiedad para destacar entre la competencia.",
    },
    {
      number: "03",
      title: "Marketing",
      description: "Implementamos una estrategia de promoción multicanal.",
    },
    {
      number: "04",
      title: "Negociación",
      description: "Gestionamos ofertas y negociamos las mejores condiciones.",
    },
    {
      number: "05",
      title: "Cierre",
      description: "Coordinamos todos los aspectos legales y administrativos.",
    },
  ];

  const scrollToContactForm = (e) => {
    e.preventDefault();
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen">
      {pageLoading && <LoadingSpinner />}

      {!pageLoading && (
        <PageTransition isLoading={!contentReady}>
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
            <div className="container mx-auto px-4 py-12 md:py-20">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Vende tu propiedad con expertos inmobiliarios
                </h1>
                <p className="text-xl md:text-2xl opacity-90 mb-8">
                  Maximiza el valor de tu inversión con nuestra asesoría
                  profesional
                </p>
                <div className="mt-8">
                  <button
                    onClick={scrollToContactForm}
                    className="bg-white text-blue-800 hover:bg-blue-100 transition py-3 px-8 rounded-lg font-bold text-lg inline-block"
                  >
                    Solicitar asesoría
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto px-4 py-12">
            {/* Introduction */}
            <div className="max-w-3xl mx-auto mb-16 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Especialistas en la venta de tu propiedad
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Sabemos que el universo inmobiliario está lleno de opciones, ya
                sea en Baja California o cualquier estado, pero solo algunas se
                ajustan realmente a lo que buscas. Por eso, te acompañamos en
                cada paso de tu búsqueda de venta de inmuebles, acercándote a la
                mejor opción. Te brindamos asesoría experta y agilizamos el
                proceso con un servicio personalizado y cercano. Somos una
                inmobiliaria cerca de ti y parte de una red internacional líder
                en la industria, lo que nos permite brindarte la experiencia y
                el servicio de primer nivel que mereces.
              </p>
            </div>

            {/* Broker Deal Image */}
            <div className="mb-16">
              <img
                src={brokerDealImg}
                alt="Profesional inmobiliario cerrando un trato"
                className="w-full max-w-4xl h-auto mx-auto rounded-lg shadow-xl object-cover"
              />
            </div>

            {/* Benefits Grid */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                ¿Por qué vendedores confían en nosotros?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
                  >
                    <div className="flex items-center mb-4">
                      {benefit.icon}
                      <h3 className="text-xl font-bold text-gray-800 ml-4">
                        {benefit.title}
                      </h3>
                    </div>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Process Steps */}
            <div className="mb-16 bg-gray-50 py-12 px-4 rounded-lg">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Nuestro proceso de venta
              </h2>
              <div className="max-w-4xl mx-auto">
                {steps.map((step, index) => (
                  <div key={index} className="flex mb-8 last:mb-0">
                    <div className="mr-6">
                      <div className="bg-blue-700 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                        {step.number}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div id="contact-form" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                ¿Listo para vender tu propiedad?
              </h2>
              <div className="max-w-3xl mx-auto">
                <SellContactForm />
              </div>
            </div>
          </div>
        </PageTransition>
      )}
    </div>
  );
}
