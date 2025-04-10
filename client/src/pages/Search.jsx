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
    sell: false,
    rent: false,
    offer: false,
    sort: "created_At",
    order: "desc",
  });
  const [pageLoading, setPageLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm") || "";
    const typeFromUrl = urlParams.get("type") || "all";
    const parkingFromUrl = urlParams.get("parking") || false;
    const furnishedFromUrl = urlParams.get("furnished") || false;
    const offerFromUrl = urlParams.get("offer") || false;
    const sortFromUrl = urlParams.get("sort") || "created_At";
    const orderFromUrl = urlParams.get("order") || "desc";

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl
    ) {
      setSideBarData({
        searchTerm: searchTermFromUrl,
        type: typeFromUrl,
        parking: parkingFromUrl === "true",
        furnished: furnishedFromUrl === "true",
        offer: offerFromUrl === "true",
        sort: sortFromUrl,
        order: orderFromUrl,
      });
    }

    const fetchListings = async () => {
      setPageLoading(true);
      try {
        const searchQuery = urlParams.toString();
        const response = await fetch(`/api/listing/?${searchQuery}`);
        const data = await response.json();
        if (data.length > 8) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
        setListings(data);
        setLoading(false);
        setPageLoading(false);
        setContentReady(true);
      } catch (error) {
        console.log(error);
        setPageLoading(false);
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sideBarData.searchTerm);
    urlParams.set("type", sideBarData.type);
    urlParams.set("parking", sideBarData.parking);
    urlParams.set("furnished", sideBarData.furnished);
    urlParams.set("offer", sideBarData.offer);
    urlParams.set("sort", sideBarData.sort);
    urlParams.set("order", sideBarData.order);
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
            <div className="p-7 border-b border-width-1 md:border-r md:min-h-screen">
              <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                <div className="flex items-center gap-2">
                  <label className="whitespace-nowrap font-semibold">
                    Término de búsqueda:
                  </label>
                  <input
                    type="text"
                    id="searchTerm"
                    placeholder="Buscar..."
                    className="border rounded-lg p-3 w-full"
                    value={sideBarData.searchTerm}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                  <label className="font-semibold">Tipo:</label>
                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      id="all"
                      className="w-5"
                      onChange={handleChange}
                      checked={sideBarData.type === "all"}
                    />
                    <span>Renta y Venta</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      id="sell"
                      className="w-5"
                      onChange={handleChange}
                      checked={sideBarData.type === "sell"}
                    />
                    <span>Venta</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      id="rent"
                      className="w-5"
                      onChange={handleChange}
                      checked={sideBarData.type === "rent"}
                    />
                    <span>Renta</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      id="offer"
                      className="w-5"
                      onChange={handleChange}
                      checked={sideBarData.offer}
                    />
                    <span>Oferta</span>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap items-center">
                  <label className="font-semibold">Amenidades:</label>
                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      id="parking"
                      className="w-5"
                      onChange={handleChange}
                      checked={sideBarData.parking}
                    />
                    <span>Cochera</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      id="furnished"
                      className="w-5"
                      onChange={handleChange}
                      checked={sideBarData.furnished}
                    />
                    <span>Amueblado</span>
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <label className="font-semibold">Ordenar por: </label>
                  <select
                    id="sort_order"
                    className="border rounded-lg p-3"
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
