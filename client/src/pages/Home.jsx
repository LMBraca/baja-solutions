import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import LoadingSpinner from "../components/LoadingSpinner";
import PageTransition from "../components/PageTransition";
import { FaSearch } from "react-icons/fa";
import homeBackground from "../assets/backgroundimagehome.jpg";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [sellListings, setSellListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/?offer=true&limit=3");
        const data = await res.json();
        const sortedListings = [...data].sort((a, b) => {
          if (a.status === "disponible" && b.status !== "disponible") return -1;
          if (a.status !== "disponible" && b.status === "disponible") return 1;
          return 0;
        });
        setOfferListings(sortedListings);
      } catch (error) {
        console.error("Error fetching offer listings:", error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/?type=rent&limit=3");
        const data = await res.json();
        const sortedListings = [...data].sort((a, b) => {
          if (a.status === "disponible" && b.status !== "disponible") return -1;
          if (a.status !== "disponible" && b.status === "disponible") return 1;
          return 0;
        });
        setRentListings(sortedListings);
      } catch (error) {
        console.error("Error fetching rent listings:", error);
      }
    };

    const fetchSellListings = async () => {
      try {
        const res = await fetch("/api/listing/?type=sell&limit=3");
        const data = await res.json();
        const sortedListings = [...data].sort((a, b) => {
          if (a.status === "disponible" && b.status !== "disponible") return -1;
          if (a.status !== "disponible" && b.status === "disponible") return 1;
          return 0;
        });
        setSellListings(sortedListings);
      } catch (error) {
        console.error("Error fetching sell listings:", error);
      }
    };

    const loadContent = async () => {
      await fetchOfferListings();
      await fetchRentListings();
      await fetchSellListings();
      setLoading(false);
      setContentReady(true);
    };

    loadContent();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  console.log(offerListings);

  return (
    <div className="min-h-screen relative">
      {loading && <LoadingSpinner />}

      {!loading && (
        <PageTransition isLoading={!contentReady}>
          <div>
            <div
              className="relative flex flex-col items-center justify-center h-[60vh] sm:h-[75vh] md:h-[85vh] bg-cover bg-center px-4 sm:px-6"
              style={{
                backgroundImage: `url(${homeBackground})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/50"></div>
              <div className="relative z-10 text-center w-full max-w-4xl mx-auto">
                <h1 className="font-['Inter'] text-white text-2xl md:text-4xl lg:text-6xl font-light mb-3 md:mb-8 leading-tight tracking-wide">
                  La mejor opción para{" "}
                  <span className="text-slate-200">
                    rentar, comprar o vender
                  </span>
                  <br className="hidden sm:block" />
                  tu propiedad
                </h1>
                <div className="font-['Inter'] text-slate-200 text-xs sm:text-base lg:text-lg mb-6 md:mb-12 font-light tracking-wide">
                  Baja Solutions es el mejor lugar para encontrar o vender tu
                  siguiente propiedad
                  <br className="hidden sm:block" />
                  Tenemos una amplia variedad de propiedades que puedes elegir
                </div>
                <form
                  onSubmit={handleSubmit}
                  className="flex items-center justify-center w-full max-w-3xl mx-auto px-2 sm:px-4"
                >
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Buscar por nombre, dirección..."
                      className="w-full px-4 py-3 sm:py-4 rounded-lg bg-white/95 backdrop-blur-sm text-gray-700 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-500 text-white p-2 sm:p-3 rounded-full hover:bg-blue-600 transition shadow-md"
                    >
                      <FaSearch className="text-sm sm:text-base" />
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="max-w-6xl mx-auto p-4 sm:p-6 flex flex-col gap-8 my-6 sm:my-10">
              {offerListings && offerListings.length > 0 && (
                <div>
                  <div className="my-3 flex justify-between items-center">
                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-600">
                      Ofertas Recientes
                    </h2>
                    <Link
                      to="/search?offer=true"
                      className="text-blue-800 text-sm hover:underline"
                    >
                      Ver más
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {offerListings.map((listing) => (
                      <ListingItem listing={listing} key={listing._id} />
                    ))}
                  </div>
                </div>
              )}

              {rentListings && rentListings.length > 0 && (
                <div>
                  <div className="my-3 flex justify-between items-center">
                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-600">
                      Propiedades en Renta Recientes
                    </h2>
                    <Link
                      to="/search?type=rent"
                      className="text-blue-800 text-sm hover:underline"
                    >
                      Ver más
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rentListings.map((listing) => (
                      <ListingItem listing={listing} key={listing._id} />
                    ))}
                  </div>
                </div>
              )}

              {sellListings && sellListings.length > 0 && (
                <div>
                  <div className="my-3 flex justify-between items-center">
                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-600">
                      Propiedades en Venta Recientes
                    </h2>
                    <Link
                      to="/search?type=sell"
                      className="text-blue-800 text-sm hover:underline"
                    >
                      Ver más
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sellListings.map((listing) => (
                      <ListingItem listing={listing} key={listing._id} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </PageTransition>
      )}
    </div>
  );
}
