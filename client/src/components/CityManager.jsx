import React, { useState, useEffect } from "react";

export default function CityManager() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newCity, setNewCity] = useState({ name: "", state: "", active: true });
  const [editCity, setEditCity] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cities");
      const data = await res.json();
      setCities(data);
      setLoading(false);
    } catch (error) {
      setError("Error al cargar ciudades: " + error.message);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    if (editCity) {
      setEditCity({ ...editCity, [name]: inputValue });
    } else {
      setNewCity({ ...newCity, [name]: inputValue });
    }
  };

  const handleAddCity = async (e) => {
    e.preventDefault();
    if (!newCity.name || !newCity.state) {
      setError("Nombre y estado son requeridos");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/cities/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCity),
      });

      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }

      fetchCities();
      setNewCity({ name: "", state: "", active: true });
      setSuccess("Ciudad añadida correctamente");
      setTimeout(() => setSuccess(null), 3000);
      setLoading(false);
    } catch (error) {
      setError("Error al añadir ciudad: " + error.message);
      setLoading(false);
    }
  };

  const handleUpdateCity = async (e) => {
    e.preventDefault();
    if (!editCity.name || !editCity.state) {
      setError("Nombre y estado son requeridos");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/cities/update/${editCity._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editCity),
      });

      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }

      fetchCities();
      setEditCity(null);
      setSuccess("Ciudad actualizada correctamente");
      setTimeout(() => setSuccess(null), 3000);
      setLoading(false);
    } catch (error) {
      setError("Error al actualizar ciudad: " + error.message);
      setLoading(false);
    }
  };

  const handleDeleteCity = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta ciudad?")) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/cities/delete/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }

      fetchCities();
      setSuccess("Ciudad eliminada correctamente");
      setTimeout(() => setSuccess(null), 3000);
      setLoading(false);
    } catch (error) {
      setError("Error al eliminar ciudad: " + error.message);
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditCity(null);
    setError(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">

      {/* Form for adding/editing cities */}
      <form
        onSubmit={editCity ? handleUpdateCity : handleAddCity}
        className="mb-6 p-4 border rounded-lg"
      >
        <h3 className="font-medium mb-3">
          {editCity ? "Editar Ciudad" : "Añadir Nueva Ciudad"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nombre de la Ciudad</label>
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              className="border p-3 rounded-lg"
              value={editCity ? editCity.name : newCity.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Estado</label>
            <input
              type="text"
              name="state"
              placeholder="Estado"
              className="border p-3 rounded-lg"
              value={editCity ? editCity.state : newCity.state}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            name="active"
            id="cityActive"
            className="w-4 h-4"
            checked={editCity ? editCity.active : newCity.active}
            onChange={handleInputChange}
          />
          <label htmlFor="cityActive" className="text-sm font-medium">
            Activa
          </label>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-75"
          >
            {loading
              ? "Procesando..."
              : editCity
              ? "Actualizar Ciudad"
              : "Añadir Ciudad"}
          </button>
          {editCity && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-gray-200 text-gray-800 p-3 rounded-lg uppercase hover:opacity-95"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      {/* List of cities */}
      <div className="mt-6">
        <h3 className="font-medium mb-3">Ciudades Disponibles</h3>
        {loading && <p className="text-center py-4">Cargando ciudades...</p>}

        {!loading && cities.length === 0 && (
          <p className="text-center py-4 text-gray-500">
            No hay ciudades agregadas aún.
          </p>
        )}

        {!loading && cities.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ciudad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cities.map((city) => (
                  <tr key={city._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{city.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {city.state}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          city.active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {city.active ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setEditCity(city)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteCity(city._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
