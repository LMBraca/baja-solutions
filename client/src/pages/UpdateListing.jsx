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
import {
  FaHome,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
  FaTree,
  FaPaw,
  FaWifi,
  FaTv,
  FaSwimmingPool,
  FaSnowflake,
  FaUtensils,
  FaCar,
  FaShower,
  FaLock,
  FaLaptop,
  FaMountain,
  FaToilet,
} from "react-icons/fa";

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
    parkingSpaces: 1,
    furnished: false,
    garden: false,
    constructionArea: 0,
    landArea: 0,
    offer: false,
    imageUrls: [],
    coverImage: "",
    latitude: null,
    longitude: null,
    currency: "USD",
    mxnPrice: "",
    usdPrice: "",
    category: "casa",
    categoryRef: "",
    cityRef: "",
    pets: false,
    customCharacteristics: [],
    youtubeUrl: "",
  });
  const [coverImageError, setCoverImageError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [formOptionsLoading, setFormOptionsLoading] = useState(false);
  const [newCharacteristic, setNewCharacteristic] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("FaHome");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const iconOptions = [
    { icon: <FaHome />, name: "FaHome", label: "Casa" },
    { icon: <FaBed />, name: "FaBed", label: "Cama" },
    { icon: <FaBath />, name: "FaBath", label: "Baño" },
    { icon: <FaParking />, name: "FaParking", label: "Estacionamiento" },
    { icon: <FaChair />, name: "FaChair", label: "Silla" },
    { icon: <FaTree />, name: "FaTree", label: "Árbol" },
    { icon: <FaPaw />, name: "FaPaw", label: "Mascota" },
    { icon: <FaWifi />, name: "FaWifi", label: "WiFi" },
    { icon: <FaTv />, name: "FaTv", label: "TV" },
    { icon: <FaSwimmingPool />, name: "FaSwimmingPool", label: "Alberca" },
    { icon: <FaSnowflake />, name: "FaSnowflake", label: "Aire Acondicionado" },
    { icon: <FaUtensils />, name: "FaUtensils", label: "Cocina" },
    { icon: <FaCar />, name: "FaCar", label: "Coche" },
    { icon: <FaShower />, name: "FaShower", label: "Ducha" },
    { icon: <FaLock />, name: "FaLock", label: "Seguridad" },
    { icon: <FaLaptop />, name: "FaLaptop", label: "Oficina" },
    { icon: <FaMountain />, name: "FaMountain", label: "Vista" },
    { icon: <FaToilet />, name: "FaToilet", label: "Inodoro" },
  ];

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
          currency: data.currency || "USD",
          mxnPrice: data.mxnPrice || "",
          usdPrice: data.usdPrice || "",
          categoryRef: data.categoryRef || "",
          cityRef: data.cityRef || "",
        });
        setPageLoading(false);
        setContentReady(true);
      } catch (error) {
        console.log(error);
        setPageLoading(false);
      }
    };
    fetchListing();

    // Fetch exchange rate
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        const data = await response.json();
        setExchangeRate(data.rates.MXN);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };

    fetchExchangeRate();
    fetchFormOptions();
  }, [params.id]);

  // Fetch categories and cities
  const fetchFormOptions = async () => {
    setFormOptionsLoading(true);
    try {
      // Fetch categories
      const categoryRes = await fetch("/api/categories");
      const categoryData = await categoryRes.json();

      if (categoryData && categoryData.length > 0) {
        setCategories(categoryData);
      }

      // Fetch cities
      const cityRes = await fetch("/api/cities");
      const cityData = await cityRes.json();

      if (cityData && cityData.length > 0) {
        setCities(cityData);
      }

      setFormOptionsLoading(false);
    } catch (error) {
      console.error("Error fetching form options:", error);
      setFormOptionsLoading(false);
    }
  };

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
              `Se subieron ${
                filesToUpload.length
              } imágenes. No se pudieron subir ${
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
    if (e.target.id === "garden") {
      setFormData({
        ...formData,
        garden: e.target.checked,
      });
    }
    if (e.target.id === "offer") {
      setFormData({
        ...formData,
        offer: e.target.checked,
      });
    }
    if (e.target.id === "pets") {
      setFormData({
        ...formData,
        pets: e.target.checked,
      });
    }
    if (e.target.id === "currency") {
      setFormData({
        ...formData,
        currency: e.target.value,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type == "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });

      // Auto-calculate the other currency price when regular price changes
      if (e.target.id === "regularPrice" && exchangeRate) {
        if (formData.currency === "USD") {
          setFormData((prev) => ({
            ...prev,
            mxnPrice: (parseFloat(e.target.value) * exchangeRate).toFixed(2),
          }));
        } else if (formData.currency === "MXN") {
          setFormData((prev) => ({
            ...prev,
            usdPrice: (parseFloat(e.target.value) / exchangeRate).toFixed(2),
          }));
        }
      }

      // Auto-calculate the other currency price when discount price changes
      if (e.target.id === "discountPrice" && exchangeRate) {
        if (formData.currency === "USD") {
          setFormData((prev) => ({
            ...prev,
            mxnDiscountPrice: (
              parseFloat(e.target.value) * exchangeRate
            ).toFixed(2),
          }));
        } else if (formData.currency === "MXN") {
          setFormData((prev) => ({
            ...prev,
            usdDiscountPrice: (
              parseFloat(e.target.value) / exchangeRate
            ).toFixed(2),
          }));
        }
      }
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

      if (!formData.categoryRef) {
        setError("Por favor seleccione una categoría");
        return;
      }

      if (!formData.cityRef) {
        setError("Por favor seleccione una ciudad");
        return;
      }

      if (!formData.constructionArea || formData.constructionArea <= 0) {
        setError("Por favor ingrese los metros cuadrados de construcción");
        return;
      }

      if (!formData.landArea || formData.landArea <= 0) {
        setError("Por favor ingrese los metros cuadrados de terreno");
        return;
      }

      setLoading(true);
      setError(false);

      // Prepare data, removing empty cityRef and categoryRef
      const submitData = {
        ...formData,
        imageUrls: [formData.coverImage, ...formData.imageUrls],
        userRef: currentUser._id,
        currency: formData.currency || "USD",
        mxnPrice: formData.mxnPrice || "",
        usdPrice: formData.usdPrice || "",
        mxnDiscountPrice: formData.mxnDiscountPrice || "",
        usdDiscountPrice: formData.usdDiscountPrice || "",
      };

      // Remove empty references to prevent MongoDB casting errors
      if (!submitData.cityRef) delete submitData.cityRef;
      if (!submitData.categoryRef) delete submitData.categoryRef;

      const res = await fetch(`/api/listing/update/${params.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
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

  const handleAddCharacteristic = (e) => {
    e.preventDefault();
    if (newCharacteristic.trim() !== "") {
      setFormData({
        ...formData,
        customCharacteristics: [
          ...formData.customCharacteristics,
          {
            text: newCharacteristic.trim(),
            icon: selectedIcon,
          },
        ],
      });
      setNewCharacteristic("");
      setSelectedIcon("FaHome"); // Reset to default icon
    }
  };

  const handleRemoveCharacteristic = (index) => {
    const updatedCharacteristics = [...formData.customCharacteristics];
    updatedCharacteristics.splice(index, 1);
    setFormData({
      ...formData,
      customCharacteristics: updatedCharacteristics,
    });
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

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="sell"
                      className="w-5 h-5"
                      onChange={handleChange}
                      checked={formData.type === "sell"}
                    />
                    <span>Venta</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="rent"
                      className="w-5 h-5"
                      onChange={handleChange}
                      checked={formData.type === "rent"}
                    />
                    <span>Renta</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="parking"
                      className="w-5 h-5"
                      onChange={handleChange}
                      checked={formData.parking}
                    />
                    <span>Cochera</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="furnished"
                      className="w-5 h-5"
                      onChange={handleChange}
                      checked={formData.furnished}
                    />
                    <span>Amueblado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="garden"
                      className="w-5 h-5"
                      onChange={handleChange}
                      checked={formData.garden}
                    />
                    <span>Jardín</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="offer"
                      className="w-5 h-5"
                      onChange={handleChange}
                      checked={formData.offer}
                    />
                    <span>Oferta</span>
                  </div>
                  {formData.type === "rent" && (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="pets"
                        className="w-5 h-5"
                        onChange={handleChange}
                        checked={formData.pets}
                      />
                      <span>Mascotas</span>
                    </div>
                  )}
                </div>

                {formData.parking && (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="number"
                      id="parkingSpaces"
                      className="border p-3 rounded-lg border-gray-300 w-full max-w-[120px]"
                      onChange={handleChange}
                      value={formData.parkingSpaces}
                      min={1}
                      max={10}
                    />
                    <span>Espacios de estacionamiento</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Recámaras"
                      className="border p-3 rounded-lg border-gray-300 w-full"
                      id="bedrooms"
                      min={0}
                      required
                      onChange={handleChange}
                      value={formData.bedrooms}
                    />
                    <p className="min-w-[80px]">Recámaras</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Baños"
                      className="border p-3 rounded-lg border-gray-300 w-full"
                      id="bathrooms"
                      min={0}
                      step={0.5}
                      required
                      onChange={handleChange}
                      value={formData.bathrooms}
                    />
                    <p className="min-w-[80px]">Baños</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      id="currency"
                      className="border p-3 rounded-lg border-gray-300 w-full"
                      onChange={handleChange}
                      value={formData.currency}
                    >
                      <option value="USD">USD</option>
                      <option value="MXN">MXN</option>
                    </select>
                    <p className="min-w-[80px]">Moneda</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      id="category"
                      className="border p-3 rounded-lg border-gray-300 w-full"
                      onChange={(e) => {
                        const selectedCategory = categories.find(
                          (cat) => cat._id === e.target.value
                        );

                        setFormData({
                          ...formData,
                          categoryRef: e.target.value,
                          category: selectedCategory
                            ? selectedCategory.name
                            : "",
                        });
                      }}
                      value={formData.categoryRef}
                      required
                    >
                      <option value="" disabled>
                        Seleccione categoría
                      </option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <p className="min-w-[80px]">Categoría</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      id="cityRef"
                      className="border p-3 rounded-lg border-gray-300 w-full"
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          cityRef: e.target.value,
                        });
                      }}
                      value={formData.cityRef}
                      required
                    >
                      <option value="" disabled>
                        Seleccione ciudad
                      </option>
                      {cities.map((city) => (
                        <option key={city._id} value={city._id}>
                          {city.name}, {city.state}
                        </option>
                      ))}
                    </select>
                    <p className="min-w-[80px]">Ciudad</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Regular Price"
                      className="border p-3 rounded-lg border-gray-300 w-full"
                      id="regularPrice"
                      required
                      onChange={handleChange}
                      value={formData.regularPrice}
                    />
                    <div className="flex flex-col min-w-[80px]">
                      <p>Precio</p>
                      <span className="text-xs">
                        ({formData.currency} /{" "}
                        {formData.type === "rent" ? "mes" : "total"})
                      </span>
                    </div>
                  </div>

                  {formData.currency === "USD" && formData.mxnPrice && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Precio en MXN"
                        className="border p-3 rounded-lg border-gray-300 w-full"
                        id="mxnPrice"
                        value={formData.mxnPrice}
                        readOnly
                      />
                      <div className="flex flex-col min-w-[80px]">
                        <p>Precio en MXN</p>
                        <span className="text-xs">
                          (MXN / {formData.type === "rent" ? "mes" : "total"})
                        </span>
                      </div>
                    </div>
                  )}

                  {formData.currency === "MXN" && formData.usdPrice && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Precio en USD"
                        className="border p-3 rounded-lg border-gray-300 w-full"
                        id="usdPrice"
                        value={formData.usdPrice}
                        readOnly
                      />
                      <div className="flex flex-col min-w-[80px]">
                        <p>Precio en USD</p>
                        <span className="text-xs">
                          (USD / {formData.type === "rent" ? "mes" : "total"})
                        </span>
                      </div>
                    </div>
                  )}

                  {formData.offer && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Precio con Descuento"
                        className="border p-3 rounded-lg border-gray-300 w-full"
                        id="discountPrice"
                        required
                        onChange={handleChange}
                        value={formData.discountPrice}
                      />
                      <div className="flex flex-col min-w-[80px]">
                        <p>Precio con Desc.</p>
                        <span className="text-xs">
                          ({formData.currency} /{" "}
                          {formData.type === "rent" ? "mes" : "total"})
                        </span>
                      </div>
                    </div>
                  )}

                  {formData.offer &&
                    formData.currency === "USD" &&
                    formData.mxnDiscountPrice && (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Precio con Descuento en MXN"
                          className="border p-3 rounded-lg border-gray-300 w-full"
                          id="mxnDiscountPrice"
                          value={formData.mxnDiscountPrice}
                          readOnly
                        />
                        <div className="flex flex-col min-w-[80px]">
                          <p>Desc. en MXN</p>
                          <span className="text-xs">
                            (MXN / {formData.type === "rent" ? "mes" : "total"})
                          </span>
                        </div>
                      </div>
                    )}

                  {formData.offer &&
                    formData.currency === "MXN" &&
                    formData.usdDiscountPrice && (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Precio con Descuento en USD"
                          className="border p-3 rounded-lg border-gray-300 w-full"
                          id="usdDiscountPrice"
                          value={formData.usdDiscountPrice}
                          readOnly
                        />
                        <div className="flex flex-col min-w-[80px]">
                          <p>Desc. en USD</p>
                          <span className="text-xs">
                            (USD / {formData.type === "rent" ? "mes" : "total"})
                          </span>
                        </div>
                      </div>
                    )}

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Metros cuadrados de construcción"
                      className="border p-3 rounded-lg border-gray-300 w-full"
                      id="constructionArea"
                      min={0}
                      required
                      onChange={handleChange}
                      value={formData.constructionArea}
                    />
                    <p className="min-w-[80px]">m² Construcción</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Metros cuadrados de terreno"
                      className="border p-3 rounded-lg border-gray-300 w-full"
                      id="landArea"
                      min={0}
                      required
                      onChange={handleChange}
                      value={formData.landArea}
                    />
                    <p className="min-w-[80px]">m² Terreno</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-full">
                    <input
                      type="text"
                      placeholder="URL de video de YouTube (opcional)"
                      className="border p-3 rounded-lg border-gray-300 w-full"
                      id="youtubeUrl"
                      onChange={handleChange}
                      value={formData.youtubeUrl}
                    />
                  </div>
                  <p className="min-w-[80px]">Video</p>
                </div>

                <div className="flex flex-col gap-4 mt-4">
                  <p className="font-semibold">Características adicionales:</p>
                  <div className="flex gap-2">
                    <div className="relative group">
                      <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="border-2 border-gray-300 p-3 rounded-lg bg-white h-[50px] w-[50px] cursor-pointer hover:border-slate-400 transition-colors flex items-center justify-center text-slate-700 text-xl"
                        title={
                          iconOptions.find(
                            (option) => option.name === selectedIcon
                          )?.label || "Seleccionar icono"
                        }
                      >
                        {
                          iconOptions.find(
                            (option) => option.name === selectedIcon
                          )?.icon
                        }
                      </button>

                      {dropdownOpen && (
                        <div className="absolute top-[58px] left-0 z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-[200px] flex flex-wrap">
                          {iconOptions.map((option) => (
                            <button
                              key={option.name}
                              type="button"
                              className={`p-2 hover:bg-gray-100 rounded flex items-center justify-center w-[40px] h-[40px] text-xl ${
                                selectedIcon === option.name
                                  ? "bg-blue-100 text-blue-700"
                                  : "text-slate-700"
                              }`}
                              onClick={() => {
                                setSelectedIcon(option.name);
                                setDropdownOpen(false);
                              }}
                              title={option.label}
                            >
                              {option.icon}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="hidden group-hover:block absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                        {
                          iconOptions.find(
                            (option) => option.name === selectedIcon
                          )?.label
                        }
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Agregar característica"
                      className="border p-3 rounded-lg border-gray-300 w-full"
                      value={newCharacteristic}
                      onChange={(e) => setNewCharacteristic(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleAddCharacteristic}
                      className="bg-slate-700 text-white p-3 rounded-lg flex-shrink-0"
                    >
                      Agregar
                    </button>
                  </div>

                  {formData.customCharacteristics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.customCharacteristics.map(
                        (characteristic, index) => (
                          <div
                            key={index}
                            className="flex items-center bg-slate-100 rounded-full px-4 py-2"
                          >
                            <span className="mr-2 flex items-center">
                              {
                                iconOptions.find(
                                  (option) =>
                                    option.name === characteristic.icon
                                )?.icon
                              }
                              <span className="ml-2">
                                {characteristic.text}
                              </span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCharacteristic(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </div>
                        )
                      )}
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
