import React, { useState, useEffect } from "react";
import TeamMember from "../components/TeamMember";
import LoadingSpinner from "../components/LoadingSpinner";
import PageTransition from "../components/PageTransition";

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

  // Sample team members data
  const teamMembers = [
    {
      name: "John Doe",
      position: "CEO y Fundador",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      linkedin: "https://linkedin.com/in/johndoe",
      // image is optional, will use default icon if not provided
    },
    {
      name: "Jane Smith",
      position: "Desarrolladora Principal",
      email: "jane@example.com",
      linkedin: "https://linkedin.com/in/janesmith",
    },
    {
      name: "Mike Johnson",
      position: "Director de Marketing",
      email: "mike@example.com",
      phone: "+1 (555) 987-6543",
    },
  ];

  return (
    <div className="min-h-screen">
      {loading && <LoadingSpinner />}

      {!loading && (
        <PageTransition isLoading={!contentReady}>
          <div className="py-20 px-4 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-slate-800">
              Acerca de Baja Solutions
            </h1>
            <p className="mb-4 text-slate-700">
              Baja Solutions es una empresa inmobiliaria que se especializa en
              vender y rentar propiedades en la región de Baja California.
            </p>
            <p className="mb-4 text-slate-700">
              Somos un equipo de profesionales inmobiliarios con experiencia que
              se dedican a ayudar a nuestros clientes a alcanzar sus objetivos
              inmobiliarios.
            </p>
            <p className="mb-4 text-slate-700">
              Nuestra misión es proporcionar a nuestros clientes servicios
              inmobiliarios de la más alta calidad y ayudarlos a alcanzar sus
              objetivos inmobiliarios.
            </p>

            {/* Team Section */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">
                Nuestro Equipo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member, index) => (
                  <TeamMember key={index} {...member} />
                ))}
              </div>
            </div>
          </div>
        </PageTransition>
      )}
    </div>
  );
};

export default About;
