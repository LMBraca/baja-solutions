import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import PageTransition from "../components/PageTransition";

export default function ForgotPassword() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
      setContentReady(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {pageLoading && <LoadingSpinner />}

      {!pageLoading && (
        <PageTransition isLoading={!contentReady}>
          <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-xl sm:text-2xl text-center font-semibold my-4 sm:my-6">
              Recuperar Contraseña
            </h1>

            {success ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                <p>
                  Se ha enviado un correo electrónico con instrucciones para
                  restablecer tu contraseña.
                </p>
                <p className="mt-4">
                  <Link to="/admin" className="text-blue-500 hover:underline">
                    Volver a Inicio de Sesión
                  </Link>
                </p>
              </div>
            ) : (
              <>
                <p className="text-center mb-6">
                  Ingresa tu correo electrónico y te enviaremos instrucciones
                  para restablecer tu contraseña.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <input
                    type="email"
                    placeholder="Correo Electrónico"
                    className="border-0 p-3 rounded-lg bg-white"
                    id="email"
                    onChange={handleChange}
                  />
                  <button
                    disabled={loading}
                    className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-75"
                  >
                    {loading ? "Enviando..." : "Enviar Instrucciones"}
                  </button>
                </form>

                <div className="mt-5 text-center">
                  {error && <p className="text-red-500 mt-3">{error}</p>}
                  <p className="mt-4">
                    <Link to="/admin" className="text-blue-500 hover:underline">
                      Volver a Inicio de Sesión
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </PageTransition>
      )}
    </div>
  );
}
