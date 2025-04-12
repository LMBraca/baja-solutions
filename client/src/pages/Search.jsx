import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import LoadingSpinner from "../components/LoadingSpinner";
import PageTransition from "../components/PageTransition";

export default function Search() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [sideBarData, setSideBarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    garden: false,
    sell: false,
    rent: false,
    offer: false,
    sort: "created_At",
    order: "desc",
    currency: "all",
    bedrooms: "",
    bathrooms: "",
    category: "all",
    categoryRef: "",
    cityRef: "",
    squareMeters: "",
  });
  const [pageLoading, setPageLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);
  const [noMoreListings, setNoMoreListings] = useState(false);
  const [propertyTerm, setPropertyTerm] = useState("");
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [formOptionsLoading, setFormOptionsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
      setContentReady(true);
    }, 500);

    // Fetch form options
    fetchFormOptions();

    return () => clearTimeout(timer);
  }, []);

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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm") || "";
    const typeFromUrl = urlParams.get("type") || "all";
    const parkingFromUrl = urlParams.get("parking") || false;
    const furnishedFromUrl = urlParams.get("furnished") || false;
    const gardenFromUrl = urlParams.get("garden") || false;
    const offerFromUrl = urlParams.get("offer") || false;
    const sortFromUrl = urlParams.get("sort") || "created_At";
    const orderFromUrl = urlParams.get("order") || "desc";
    const currencyFromUrl = urlParams.get("currency") || "all";
    const bedroomsFromUrl = urlParams.get("bedrooms") || "";
    const bathroomsFromUrl = urlParams.get("bathrooms") || "";
    const categoryFromUrl = urlParams.get("category") || "all";
    const categoryRefFromUrl = urlParams.get("categoryRef") || "";
    const cityRefFromUrl = urlParams.get("cityRef") || "";
    const squareMetersFromUrl = urlParams.get("squareMeters") || "";

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      gardenFromUrl ||
      offerFromUrl ||
      currencyFromUrl ||
      bedroomsFromUrl ||
      bathroomsFromUrl ||
      categoryFromUrl ||
      categoryRefFromUrl ||
      cityRefFromUrl ||
      squareMetersFromUrl
    ) {
      setSideBarData({
        searchTerm: searchTermFromUrl,
        type: typeFromUrl,
        parking: parkingFromUrl === "true",
        furnished: furnishedFromUrl === "true",
        garden: gardenFromUrl === "true",
        offer: offerFromUrl === "true",
        sort: sortFromUrl,
        order: orderFromUrl,
        currency: currencyFromUrl,
        bedrooms: bedroomsFromUrl,
        bathrooms: bathroomsFromUrl,
        category: categoryFromUrl,
        categoryRef: categoryRefFromUrl,
        cityRef: cityRefFromUrl,
        squareMeters: squareMetersFromUrl,
      });
    }

    const fetchListings = async () => {
      try {
        setLoading(true);
        setNoMoreListings(false);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing?${searchQuery}`);
        const data = await res.json();

        if (data.length == 0) {
          setNoMoreListings(true);
        }
        setSearchData({
          searchTermFromUrl,
          typeFromUrl,
          listings: data.length,
          parkingFromUrl: parkingFromUrl === "true" ? "Sí" : "No",
          furnishedFromUrl: furnishedFromUrl === "true" ? "Sí" : "No",
          offerFromUrl: offerFromUrl === "true" ? "Sí" : "No",
        });
        setSearchInitiated(false);
        setListings(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "sell" ||
      e.target.id === "rent"
    ) {
      setSideBarData({ ...sideBarData, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSideBarData({ ...sideBarData, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSideBarData({
        ...sideBarData,
        [e.target.id]:
          e.target.checked || e.target.id === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSideBarData({ ...sideBarData, sort, order });
    }

    if (e.target.id === "currency") {
      setSideBarData({ ...sideBarData, currency: e.target.value });
    }

    if (e.target.id === "bedrooms" || e.target.id === "bathrooms") {
      setSideBarData({ ...sideBarData, [e.target.id]: e.target.value });
    }

    if (e.target.id === "category") {
      setSideBarData({ ...sideBarData, category: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sideBarData.searchTerm);
    urlParams.set("type", sideBarData.type);
    urlParams.set("parking", sideBarData.parking);
    urlParams.set("furnished", sideBarData.furnished);
    urlParams.set("garden", sideBarData.garden);
    urlParams.set("offer", sideBarData.offer);
    urlParams.set("sort", sideBarData.sort);
    urlParams.set("order", sideBarData.order);
    urlParams.set("currency", sideBarData.currency);
    urlParams.set("bedrooms", sideBarData.bedrooms);
    urlParams.set("bathrooms", sideBarData.bathrooms);

    // Add category filtering - prefer categoryRef if available
    if (sideBarData.categoryRef) {
      urlParams.set("categoryRef", sideBarData.categoryRef);
    } else {
      urlParams.set("category", sideBarData.category);
    }

    // Add city filtering - only if there's a valid value
    if (sideBarData.cityRef && sideBarData.cityRef !== "") {
      urlParams.set("cityRef", sideBarData.cityRef);
    }

    urlParams.set("squareMeters", sideBarData.squareMeters);
    const searchQuery = `?${urlParams.toString()}`;
    navigate(`/search${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = `?${urlParams.toString()}`;
    const res = await fetch(`/api/listing/?${searchQuery}`);
    const data = await res.json();
    if (data.length > 8) {
      setShowMore(true);
    } else {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className="min-h-screen">
      {pageLoading && <LoadingSpinner />}

      {!pageLoading && (
        <PageTransition isLoading={!contentReady}>
          <div className="flex flex-col md:flex-row">
            <div className="p-7 border-b border-width-1 md:border-r md:min-h-screen md:w-1/4">
              <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    id="searchTerm"
                    placeholder="Buscar..."
                    className="border rounded-lg p-3 w-full"
                    value={sideBarData.searchTerm}
                    onChange={handleChange}
                  />
                </div>

                {/* Tipo de propiedad - grid layout */}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold">Tipo:</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="all"
                        className="w-5 h-5"
                        onChange={handleChange}
                        checked={sideBarData.type === "all"}
                      />
                      <span>Renta y Venta</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="sell"
                        className="w-5 h-5"
                        onChange={handleChange}
                        checked={sideBarData.type === "sell"}
                      />
                      <span>Venta</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="rent"
                        className="w-5 h-5"
                        onChange={handleChange}
                        checked={sideBarData.type === "rent"}
                      />
                      <span>Renta</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="offer"
                        className="w-5 h-5"
                        onChange={handleChange}
                        checked={sideBarData.offer}
                      />
                      <span>Oferta</span>
                    </div>
                  </div>
                </div>

                {/* Características - grid layout */}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold">Características:</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="parking"
                        className="w-5 h-5"
                        onChange={handleChange}
                        checked={sideBarData.parking}
                      />
                      <span>Cochera</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="furnished"
                        className="w-5 h-5"
                        onChange={handleChange}
                        checked={sideBarData.furnished}
                      />
                      <span>Amueblado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="garden"
                        className="w-5 h-5"
                        onChange={handleChange}
                        checked={sideBarData.garden}
                      />
                      <span>Jardín</span>
                    </div>
                  </div>
                </div>

                {/* Filters and options - single column layout */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <label className="font-semibold min-w-[80px]">
                      Ordenar:{" "}
                    </label>
                    <select
                      id="sort_order"
                      className="border rounded-lg p-3 w-full"
                      onChange={handleChange}
                      defaultValue={"created_at_desc"}
                    >
                      <option value="createdAt_desc">Más recientes</option>
                      <option value="createdAt_asc">Más antiguos</option>
                      <option value="regularPrice_asc">
                        Precio: Menor a Mayor
                      </option>
                      <option value="regularPrice_desc">
                        Precio: Mayor a Menor
                      </option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="font-semibold min-w-[80px]">
                      Moneda:{" "}
                    </label>
                    <select
                      id="currency"
                      className="border rounded-lg p-3 w-full"
                      onChange={handleChange}
                      value={sideBarData.currency}
                    >
                      <option value="all">Todas</option>
                      <option value="USD">USD</option>
                      <option value="MXN">MXN</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="font-semibold min-w-[80px]">
                      Categoría:{" "}
                    </label>
                    <select
                      id="categoryRef"
                      className="border rounded-lg p-3 w-full"
                      onChange={(e) => {
                        if (e.target.value === "all") {
                          setSideBarData({
                            ...sideBarData,
                            category: "all",
                            categoryRef: "",
                          });
                        } else {
                          const selectedCategory = categories.find(
                            (cat) => cat._id === e.target.value
                          );
                          setSideBarData({
                            ...sideBarData,
                            categoryRef: e.target.value,
                            category: selectedCategory
                              ? selectedCategory.name
                              : "",
                          });
                        }
                      }}
                      value={sideBarData.categoryRef || "all"}
                    >
                      <option value="all">Todas las categorías</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="font-semibold min-w-[80px]">
                      Ciudad:{" "}
                    </label>
                    <select
                      id="cityRef"
                      className="border rounded-lg p-3 w-full"
                      onChange={(e) => {
                        setSideBarData({
                          ...sideBarData,
                          cityRef: e.target.value,
                        });
                      }}
                      value={sideBarData.cityRef}
                    >
                      <option value="">Todas las ciudades</option>
                      {cities.map((city) => (
                        <option key={city._id} value={city._id}>
                          {city.name}, {city.state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="font-semibold min-w-[80px]">
                      Recámaras:{" "}
                    </label>
                    <select
                      id="bedrooms"
                      className="border rounded-lg p-3 w-full"
                      onChange={handleChange}
                      value={sideBarData.bedrooms}
                    >
                      <option value="">Cualquiera</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5+</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="font-semibold min-w-[80px]">
                      Baños:{" "}
                    </label>
                    <select
                      id="bathrooms"
                      className="border rounded-lg p-3 w-full"
                      onChange={handleChange}
                      value={sideBarData.bathrooms}
                    >
                      <option value="">Cualquiera</option>
                      <option value="1">1+</option>
                      <option value="1.5">1.5+</option>
                      <option value="2">2+</option>
                      <option value="2.5">2.5+</option>
                      <option value="3">3+</option>
                      <option value="3.5">3.5+</option>
                      <option value="4">4+</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="font-semibold min-w-[80px]">
                      M² mínimo:{" "}
                    </label>
                    <input
                      type="number"
                      id="squareMeters"
                      className="border rounded-lg p-3 w-full"
                      onChange={handleChange}
                      value={sideBarData.squareMeters}
                      placeholder="Mínimo"
                      min="0"
                    />
                  </div>
                </div>

                <button
                  className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
                  type="submit"
                >
                  Buscar
                </button>
              </form>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-semibold border-b p-3 mt-5 text-slate-700">
                Resultados de búsqueda:
              </h1>

              <div className="p-7 flex flex-wrap gap-4">
                {!loading && listings.length === 0 && (
                  <p className="text-center text-2xl font-semibold text-slate-700">
                    No se encontraron resultados
                  </p>
                )}

                {loading && (
                  <p className="text-center text-2xl font-semibold text-slate-700 w-full">
                    Cargando...
                  </p>
                )}

                {!loading &&
                  listings &&
                  listings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                  ))}

                {showMore && (
                  <button
                    className="text-green-700 p-7 text-center w-full rounded-lg hover:underline"
                    onClick={() => handleShowMore()}
                  >
                    Mostrar más
                  </button>
                )}
              </div>
            </div>
          </div>
        </PageTransition>
      )}
    </div>
  );
}
