import React, { useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import PageTransition from "../components/PageTransition";
import { Map } from "../components/Map";

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: "",
    discountPrice: "",
    type: "rent",
    parking: false,
    furnished: false,
    offer: false,
    imageUrls: [],
    coverImage: "",
    latitude: null,
    longitude: null,
  });
  const [coverImageError, setCoverImageError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      setPageLoading(true);
      try {
        const listingId = params.id;
        const res = await fetch(`/api/listing/${listingId}`);
        const data = await res.json();
        if (data.success === false) {
          return;
        }
        const [coverImage, ...additionalImages] = data.imageUrls;
        setFormData({
          ...data,
          coverImage: coverImage || "",
          imageUrls: additionalImages || [],
        });
        setPageLoading(false);
        setContentReady(true);
      } catch (error) {
        console.log(error);
        setPageLoading(false);
      }
    };
    fetchListing();
  }, [params.id]);

  const handleCoverImageSubmit = () => {
    if (files.length === 0) {
      setCoverImageError("Por favor seleccione una imagen");
      return;
    }

    if (!formData.coverImage) {
      const file = files[0];
      setUploading(true);
      setCoverImageError("");

      storeImage(file)
        .then((url) => {
          setFormData({
            ...formData,
            coverImage: url,
          });
          setUploading(false);
        })
        .catch((err) => {
          setCoverImageError(
            "Error al subir la imagen (máximo 5 MB por imagen)"
          );
          setUploading(false);
        });
    } else {
      setCoverImageError(
        "Ya existe una imagen de portada. Elimínela primero para subir una nueva."
      );
    }
  };

  const handleRemoveCoverImage = () => {
    setFormData({
      ...formData,
      coverImage: "",
    });
  };

  const handleImageSubmit = () => {
    if (files.length > 0 && formData.imageUrls.length < 24) {
      const remainingSlots = 24 - formData.imageUrls.length;
      const filesArray = Array.from(files);
      const filesToUpload = filesArray.slice(0, remainingSlots);
      const promises = [];
      setUploading(true);

      for (let i = 0; i < filesToUpload.length; i++) {
        promises.push(storeImage(filesToUpload[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });

          if (filesArray.length > remainingSlots) {
            setImageUploadError(
              `Se subieron ${filesToUpload.length} imágenes. No se pudieron subir ${
                filesArray.length - remainingSlots
              } más ya que el máximo es de 24 imágenes en total.`
            );
          } else {
            setImageUploadError("");
          }
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError(
            "Error al subir la imagen (máximo 5 MB por imagen)"
          );
          setUploading(false);
        });
    } else if (files.length == 0) {
      setImageUploadError("No se seleccionaron imágenes");
    } else {
      setImageUploadError("Se alcanzó el máximo de 24 imágenes");
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sell" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (e.target.id === "parking") {
      setFormData({
        ...formData,
        parking: e.target.checked,
      });
    }
    if (e.target.id === "furnished") {
      setFormData({
        ...formData,
        furnished: e.target.checked,
      });
    }
    if (e.target.id === "offer") {
      setFormData({
        ...formData,
        offer: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type == "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleAddressSelect = (address, coordinates) => {
    setFormData({
      ...formData,
      address: address,
      ...(coordinates && {
        latitude: coordinates.lat,
        longitude: coordinates.lng,
      }),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.coverImage) {
        setError("Por favor suba una imagen de portada");
        return;
      }

      if (+formData.regularPrice < +formData.discountPrice) {
        setError(
          "El precio con descuento no puede ser mayor que el precio regular"
        );
        return;
      }

      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          imageUrls: [formData.coverImage, ...formData.imageUrls],
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      navigate(`/listing/${data._id}`);
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
          <main className="p-3 max-w-4xl mx-auto">
            <h1 className="text-3xl text-center font-semibold my-7">
              Actualizar listado
            </h1>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="flex flex-col gap-4 flex-1">
                <input
                  type="text"
                  placeholder="Nombre"
                  className="border p-3 rounded-lg"
                  id="name"
                  maxLength="62"
                  required
                  onChange={handleChange}
                  value={formData.name}
                />
                <textarea
                  type="text"
                  placeholder="Descripción"
                  className="border p-3 rounded-lg"
                  id="description"
                  maxLength="100000"
                  required
                  onChange={handleChange}
                  value={formData.description}
                />

                <div>
                  <Map
                    onAddressSelect={handleAddressSelect}
                    initialLocation={
                      formData.latitude && formData.longitude
                        ? {
                            lat: formData.latitude,
                            lng: formData.longitude,
                          }
                        : null
                    }
                    centerOnMarkerPlacement={false}
                />
                </div>

                <div className="flex gap-6 flex-wrap">
                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      id="sell"
                      className="w-5"
                      onChange={handleChange}
                      checked={formData.type === "sell"}
                    />
                    <span>Venta</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      id="rent"
                      className="w-5"
                      onChange={handleChange}
                      checked={formData.type === "rent"}
                    />
                    <span>Renta</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      id="parking"
                      className="w-5"
                      onChange={handleChange}
                      checked={formData.parking}
                    />
                    <span>Cochera</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      id="furnished"
                      className="w-5"
                      onChange={handleChange}
                      checked={formData.furnished}
                    />
                    <span>Amueblado</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      id="offer"
                      className="w-5"
                      onChange={handleChange}
                      checked={formData.offer}
                    />
                    <span>Oferta</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Recámaras"
                      className="border p-3 rounded-lg border-gray-300"
                      id="bedrooms"
                      min={1}
                      required
                      onChange={handleChange}
                      value={formData.bedrooms}
                    />
                    <p>Recámaras</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Baños"
                      className="border p-3 rounded-lg border-gray-300"
                      id="bathrooms"
                      min={1}
                      required
                      onChange={handleChange}
                      value={formData.bathrooms}
                    />
                    <p>Baños</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Precio"
                      className="border p-3 rounded-lg border-gray-300"
                      id="regularPrice"
                      required
                      onChange={handleChange}
                      value={formData.regularPrice}
                    />
                    <div className="flex flex-col items-center">
                      <p>Precio</p>
                      <span className="text-xs">($ / mes)</span>
                    </div>
                  </div>

                  {formData.offer && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Precio con Descuento"
                        className="border p-3 rounded-lg border-gray-300"
                        id="discountPrice"
                        required
                        onChange={handleChange}
                        value={formData.discountPrice}
                      />
                      <div className="flex flex-col items-center">
                        <p>Precio con Descuento</p>
                        <span className="text-xs">($ / mes)</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col flex-1 gap-4">
                <div className="flex flex-col gap-2">
                <p className="font-semibold">
                    Imagen de portada:
                    <span className="font-normal text-gray-600 ml-2">
                      Esta será la imagen principal de tu listado
                    </span>
                  </p>
                  <div className="flex gap-4">
                    <input
                    onChange={(e) => setFiles(e.target.files)}
                    type="file"
                      id="cover"
                    accept="image/*"
                      className="hidden"
                    />
                    <label
                      htmlFor="cover"
                      className="p-3 border border-gray-300 rounded cursor-pointer w-full text-center uppercase hover:shadow-lg"
                    >
                      Imagen de portada
                    </label>
                  <button
                    type="button"
                    onClick={handleCoverImageSubmit}
                      className="p-3 border border-green-700 text-green-700 w-full rounded uppercase hover:shadow-lg disabled:opacity-80"
                      disabled={uploading}
                  >
                    {uploading ? "Subiendo..." : "Subir"}
                  </button>
                  </div>
                  {coverImageError && (
                    <p className="text-sm text-red-700">{coverImageError}</p>
                  )}
                  {formData.coverImage && (
                    <div className="flex justify-between p-3 border items-center">
                      <img
                        src={formData.coverImage}
                        alt="cover image"
                        className="h-20 object-contain"
                      />
                  <button
                    type="button"
                    onClick={handleRemoveCoverImage}
                        className="p-3 text-red-700 hover:opacity-75"
                  >
                    Eliminar
                  </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                <p className="font-semibold">
                    Imágenes adicionales:
                    <span className="font-normal text-gray-600 ml-2">
                      Agrega más imágenes (máximo 24)
                  </span>
                </p>
                <div className="flex gap-4">
                  <input
                    onChange={(e) => setFiles(e.target.files)}
                    type="file"
                      id="images"
                    multiple
                      accept="image/*"
                      className="hidden"
                    />
                    <label
                      htmlFor="images"
                      className="p-3 border border-gray-300 rounded cursor-pointer w-full text-center uppercase hover:shadow-lg"
                  >
                      Elegir imágenes
                    </label>
                  <button
                    type="button"
                      onClick={handleImageSubmit}
                      className="p-3 border border-green-700 text-green-700 w-full rounded uppercase hover:shadow-lg disabled:opacity-80"
                      disabled={uploading}
                    >
                      {uploading ? "Subiendo..." : "Subir"}
                  </button>
                </div>
                  <div className="text-center">
                    {imageUploadError && (
                      <p className="text-sm text-red-700">{imageUploadError}</p>
                    )}
                    {formData.imageUrls.length > 0 &&
                      formData.imageUrls.map((url, index) => (
                        <div
                          key={url}
                          className="flex justify-between p-3 border items-center"
                        >
                      <img
                        src={url}
                            alt="listing image"
                            className="h-20 object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                            className="p-3 text-red-700 hover:opacity-75"
                      >
                            ELIMINAR
                      </button>
                    </div>
                  ))}
                  </div>
                </div>

                <button
                  disabled={loading || uploading}
                  className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-90 disabled:opacity-80"
                >
                  {loading ? "Actualizando..." : "Actualizar listado"}
                </button>
                {error && <p className="text-red-700 text-sm">{error}</p>}
              </div>
            </form>
          </main>
        </PageTransition>
      )}
    </div>
  );
}
