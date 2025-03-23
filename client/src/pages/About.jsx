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
      position: "CEO & Founder",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      linkedin: "https://linkedin.com/in/johndoe",
      // image is optional, will use default icon if not provided
    },
    {
      name: "Jane Smith",
      position: "Lead Developer",
      email: "jane@example.com",
      linkedin: "https://linkedin.com/in/janesmith",
    },
    {
      name: "Mike Johnson",
      position: "Marketing Director",
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
              About Baja Solutions
            </h1>
            <p className="mb-4 text-slate-700">
              Baja Solutions is a real estate company that specializes in
              selling and renting properties in the Baja California region.
            </p>
            <p className="mb-4 text-slate-700">
              We are a team of experienced real estate professionals who are
              dedicated to helping our clients achieve their real estate goals.
            </p>
            <p className="mb-4 text-slate-700">
              Our mission is to provide our clients with the highest quality
              real estate services and to help them achieve their real estate
              goals.
            </p>

            {/* Team Section */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">
                Our Team
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
