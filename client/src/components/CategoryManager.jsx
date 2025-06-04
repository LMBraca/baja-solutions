import React, { useState, useEffect } from "react";

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: "", active: true });
  const [editCategory, setEditCategory] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
      setLoading(false);
    } catch (error) {
      setError("Error al cargar categorías: " + error.message);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    if (editCategory) {
      setEditCategory({ ...editCategory, [name]: inputValue });
    } else {
      setNewCategory({ ...newCategory, [name]: inputValue });
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name) {
      setError("Nombre es requerido");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/categories/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });

      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }

      fetchCategories();
      setNewCategory({ name: "", active: true });
      setSuccess("Categoría añadida correctamente");
      setTimeout(() => setSuccess(null), 3000);
      setLoading(false);
    } catch (error) {
      setError("Error al añadir categoría: " + error.message);
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editCategory.name) {
      setError("Nombre es requerido");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/categories/update/${editCategory._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editCategory),
      });

      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }

      fetchCategories();
      setEditCategory(null);
      setSuccess("Categoría actualizada correctamente");
      setTimeout(() => setSuccess(null), 3000);
      setLoading(false);
    } catch (error) {
      setError("Error al actualizar categoría: " + error.message);
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (
      !window.confirm("¿Estás seguro de que deseas eliminar esta categoría?")
    ) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/categories/delete/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }

      fetchCategories();
      setSuccess("Categoría eliminada correctamente");
      setTimeout(() => setSuccess(null), 3000);
      setLoading(false);
    } catch (error) {
      setError("Error al eliminar categoría: " + error.message);
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditCategory(null);
    setError(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">

      {/* Form for adding/editing categories */}
      <form
        onSubmit={editCategory ? handleUpdateCategory : handleAddCategory}
        className="mb-6 p-4 border rounded-lg"
      >
        <h3 className="font-medium mb-3">
          {editCategory ? "Editar Categoría" : "Añadir Nueva Categoría"}
        </h3>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              Nombre de la Categoría
            </label>
            <input
              type="text"
              name="name"
              placeholder="Nombre (ej. Casa, Condominio, Departamento...)"
              className="border p-3 rounded-lg"
              value={editCategory ? editCategory.name : newCategory.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="active"
              id="categoryActive"
              className="w-4 h-4"
              checked={editCategory ? editCategory.active : newCategory.active}
              onChange={handleInputChange}
            />
            <label htmlFor="categoryActive" className="text-sm font-medium">
              Activa
            </label>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-75"
          >
            {loading
              ? "Procesando..."
              : editCategory
              ? "Actualizar Categoría"
              : "Añadir Categoría"}
          </button>
          {editCategory && (
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

      {/* List of categories */}
      <div className="mt-6">
        <h3 className="font-medium mb-3">Categorías Disponibles</h3>
        {loading && <p className="text-center py-4">Cargando categorías...</p>}

        {!loading && categories.length === 0 && (
          <p className="text-center py-4 text-gray-500">
            No hay categorías agregadas aún.
          </p>
        )}

        {!loading && categories.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
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
                {categories.map((category) => (
                  <tr key={category._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          category.active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {category.active ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setEditCategory(category)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
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
