import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import PageTransition from "../components/PageTransition";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutStart,
  signoutSuccess,
  signoutFailure,
} from "../redux/user/userSlice";

// Common country codes for dropdown
const countryCodes = [
  { code: "+1", country: "US/Canada" },
  { code: "+44", country: "UK" },
  { code: "+52", country: "Mexico" },
  { code: "+33", country: "France" },
  { code: "+49", country: "Germany" },
  { code: "+34", country: "Spain" },
  { code: "+39", country: "Italy" },
  { code: "+81", country: "Japan" },
  { code: "+86", country: "China" },
  { code: "+91", country: "India" },
  { code: "+55", country: "Brazil" },
  { code: "+61", country: "Australia" },
];

export default function Profile() {
  const [formData, setFormData] = useState({});
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [phoneNumberParts, setPhoneNumberParts] = useState({
    areaCode: "+1",
    number: "",
  });
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [inviteError, setInviteError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
      setContentReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (currentUser?.phoneNumber) {
      // Try to parse the phone number into area code and number
      const match = currentUser.phoneNumber.match(/^(\+\d+)\s+(.+)$/);
      if (match) {
        setPhoneNumberParts({
          areaCode: match[1],
          number: match[2],
        });
      }
    }

    // Fetch user listings when profile loads
    handleShowListings();
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handlePhoneChange = (e) => {
    setPhoneNumberParts({
      ...phoneNumberParts,
      [e.target.id]: e.target.value,
    });

    // Update the formData with the full phone number
    setFormData({
      ...formData,
      phoneNumber: `${
        e.target.id === "areaCode" ? e.target.value : phoneNumberParts.areaCode
      } ${e.target.id === "number" ? e.target.value : phoneNumberParts.number}`,
    });
  };

  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar tu cuenta?")) {
      return;
    }

    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signoutStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutFailure(data.message));
        return;
      }
      dispatch(signoutSuccess(data));
    } catch (error) {
      dispatch(signoutFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(data.message);
        return;
      }
      setUserListings(data);
      setShowListingsError(false);
    } catch (error) {
      setShowListingsError(error.message);
    }
  };

  const handleListingDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este publicación?")) {
      return;
    }

    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(data.message);
        return;
      }
      setUserListings(userListings.filter((listing) => listing._id !== id));
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      setInviteLoading(true);
      setInviteError(null);

      const res = await fetch("/api/user/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inviteEmail,
          adminName: currentUser.username,
          adminEmail: currentUser.email,
        }),
      });

      const data = await res.json();

      if (data.success === false) {
        setInviteError(data.message);
        setInviteLoading(false);
        return;
      }

      setInviteSuccess(true);
      setInviteEmail("");
      setInviteLoading(false);

      setTimeout(() => {
        setInviteSuccess(false);
      }, 3000);
    } catch (error) {
      setInviteError(error.message);
      setInviteLoading(false);
    }
  };

  // Calculate percentage for progress bars
  const calculatePercentage = (used, total) => {
    return Math.min(Math.round((used / total) * 100), 100);
  };

  return (
    <div className="min-h-screen">
      {pageLoading && <LoadingSpinner />}

      {!pageLoading && (
        <PageTransition isLoading={!contentReady}>
          <div className="p-3 max-w-6xl mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Perfil</h1>

            {/* Navigation Tabs */}
            <div className="flex border-b mb-6">
              <button
                className={`py-3 px-6 font-medium ${
                  activeTab === "profile"
                    ? "border-b-2 border-slate-700 text-slate-800"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                Perfil
              </button>
              <button
                className={`py-3 px-6 font-medium ${
                  activeTab === "listings"
                    ? "border-b-2 border-slate-700 text-slate-800"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                onClick={() => setActiveTab("listings")}
              >
                Listados
              </button>

              <button
                className={`py-3 px-6 font-medium ${
                  activeTab === "admin"
                    ? "border-b-2 border-slate-700 text-slate-800"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                onClick={() => setActiveTab("admin")}
              >
                Administrador
              </button>
            </div>

            {/* Profile Information Section */}
            {activeTab === "profile" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">
                  Información Personal
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Nombre</label>
                    <input
                      type="text"
                      placeholder="username"
                      id="username"
                      className="border p-3 rounded-lg"
                      defaultValue={currentUser.username}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Correo electrónico</label>
                    <input
                      type="email"
                      placeholder="email"
                      id="email"
                      className="border p-3 rounded-lg"
                      defaultValue={currentUser.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Teléfono</label>
                    <div className="flex gap-2">
                    <select
                      id="areaCode"
                        className="border p-3 rounded-lg w-1/3"
                      value={phoneNumberParts.areaCode}
                      onChange={handlePhoneChange}
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                            {country.code} ({country.country})
                        </option>
                      ))}
                    </select>
                    <input
                        type="tel"
                        placeholder="Número de teléfono"
                      id="number"
                        className="border p-3 rounded-lg flex-1"
                      value={phoneNumberParts.number}
                      onChange={handlePhoneChange}
                    />
                  </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Contraseña</label>
                    <input
                      type="password"
                      placeholder="Nueva contraseña"
                      id="password"
                      className="border p-3 rounded-lg"
                      onChange={handleChange}
                    />
                    <p className="text-xs text-gray-500">
                      Dejar en blanco para mantener la contraseña actual
                    </p>
                  </div>

                  <button
                    className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
                    disabled={loading}
                  >
                    {loading ? "Actualizando..." : "Actualizar perfil"}
                  </button>
                </form>

                {error && <p className="text-red-700 mt-5">{error}</p>}
                {updateSuccess && (
                  <p className="text-green-700 mt-5">
                    Perfil actualizado correctamente
                  </p>
                )}

                <div className="flex justify-between mt-5">
                  <button
                    className="text-red-700 hover:underline"
                    onClick={handleDelete}
                  >
                    Eliminar cuenta
                  </button>
                  <button
                    className="text-red-700 hover:underline"
                    onClick={handleSignOut}
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}

           

            {/* Listings Section */}
            {activeTab === "listings" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Mis Publicaciones</h2>
                  <Link
                    to={"/create-listing"}
                    className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-800"
                  >
                    Crear nueva publicación
                  </Link>
                </div>

                {showListingsError && (
                  <p className="text-red-700 mb-4">
                    Error al obtener publicaciones: {showListingsError}
                  </p>
                )}

                {userListings && userListings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userListings.map((listing) => (
                      <div
                        key={listing._id}
                        className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <Link to={`/listing/${listing._id}`}>
                          <div className="h-40 overflow-hidden">
                            <img
                              src={listing.imageUrls[0]}
                              alt="listing cover"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </Link>
                        <div className="p-3">
                          <Link
                            className="text-slate-700 font-semibold hover:underline truncate block"
                            to={`/listing/${listing._id}`}
                          >
                            <p className="truncate">{listing.name}</p>
                          </Link>
                          <p className="text-sm text-gray-500 truncate">
                            {listing.address}
                          </p>
                          <p className="font-bold text-slate-900">
                            ${listing.regularPrice.toLocaleString()}
                            {listing.type === "rent" && " / month"}
                          </p>
                          <div className="flex justify-between mt-3">
                            <button
                              className="text-red-700 text-sm hover:underline"
                              onClick={() => handleListingDelete(listing._id)}
                            >
                              Delete
                            </button>
                            <Link to={`/update-listing/${listing._id}`}>
                              <button className="text-green-700 text-sm hover:underline">
                                Edit
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    No tienes ninguna publicación aún. Haz clic en "Crear nueva publicación"
                    para empezar!
                  </div>
                )}
              </div>
            )}

            {/* Admin Section */}
            {activeTab === "admin" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">
                  Opciones de Administrador
                </h2>

                <div className="mb-8">
                  <h3 className="font-medium mb-3">Invitar Administrador</h3>
                  <form onSubmit={handleInvite} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        placeholder="Ingrese correo electrónico"
                        className="border p-3 rounded-lg"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Enviar una invitación para convertirse en administrador
                      </p>
                    </div>

                    <button
                      disabled={inviteLoading}
                      className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-75 w-full md:w-auto"
                    >
                      {inviteLoading ? "Enviando..." : "Enviar invitación"}
                    </button>
                  </form>

                  {inviteSuccess && (
                    <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
                      Invitación enviada correctamente!
                    </div>
                  )}

                  {inviteError && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                      {inviteError}
                    </div>
                  )}
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium mb-3">Privilegios de Administrador</h3>
                  <ul className="list-disc list-inside text-sm space-y-2 pl-2">
                    <li>Crear, editar y eliminar publicaciones de propiedad</li>
                    <li>Invitar a otros administradores a la plataforma</li>
                    <li>Acceso a funciones de gestión de usuarios</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </PageTransition>
      )}
    </div>
  );
}
