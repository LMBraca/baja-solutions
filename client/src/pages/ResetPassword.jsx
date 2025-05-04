import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import PageTransition from "../components/PageTransition";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ token });
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

  useEffect(() => {
    // Update token in formData when it changes from URL
    setFormData((prev) => ({ ...prev, token }));
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.newPassword || !formData.confirmPassword) {
      setError("Both passwords are required");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: formData.token,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate("/admin");
      }, 3000);
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
              Restablecer Contraseña
            </h1>

            {success ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                <p>Tu contraseña ha sido restablecida exitosamente.</p>
                <p>
                  Serás redirigido a la página de inicio de sesión en unos
                  segundos...
                </p>
                <p className="mt-4">
                  <Link to="/admin" className="text-blue-500 hover:underline">
                    Ir a Inicio de Sesión
                  </Link>
                </p>
              </div>
            ) : (
              <>
                <p className="text-center mb-6">
                  Ingresa tu nueva contraseña a continuación.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <input
                    type="password"
                    placeholder="Nueva Contraseña"
                    className="border-0 p-3 rounded-lg bg-white"
                    id="newPassword"
                    onChange={handleChange}
                    minLength="6"
                  />
                  <input
                    type="password"
                    placeholder="Confirmar Contraseña"
                    className="border-0 p-3 rounded-lg bg-white"
                    id="confirmPassword"
                    onChange={handleChange}
                    minLength="6"
                  />
                  <button
                    disabled={loading}
                    className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-75"
                  >
                    {loading ? "Procesando..." : "Restablecer Contraseña"}
                  </button>
                </form>

                <div className="mt-5 text-center">
                  {error && <p className="text-red-500 mt-3">{error}</p>}
                </div>
              </>
            )}
          </div>
        </PageTransition>
      )}
    </div>
  );
}
