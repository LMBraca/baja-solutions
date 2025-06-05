import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaShare,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
  FaHome,
  FaTree,
  FaRuler,
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
import LoadingSpinner from "../components/LoadingSpinner";
import PageTransition from "../components/PageTransition";
import { Map } from "../components/Map";
import ContactForm from "../components/ContactForm";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [copied, setCopied] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  // Add this function to format YouTube URLs
  const formatYoutubeUrl = (url) => {
    if (!url) return "";

    // Handle different YouTube URL formats
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : "";
  };

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/listing/${params.id}`);
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          setLoading(false);
          return;
        }
        setListing(data);
      } catch (error) {
        setLoading(false);
        setError(error.message);
      }
    };
    fetchListing();
  }, [params.id]);

  useEffect(() => {
    if (listing) {
      const imagePromises = listing.imageUrls.map((url) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = url;
          img.onload = resolve;
        });
      });

      Promise.all(imagePromises).then(() => {
        setImagesLoaded(true);
        setLoading(false);
        setTimeout(() => setContentVisible(true), 100);
      });
    }
  }, [listing]);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedImageIndex(null);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    } else {
      setSelectedImageIndex(listing.imageUrls.length - 1);
    }
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (selectedImageIndex < listing.imageUrls.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    } else {
      setSelectedImageIndex(0);
    }
  };

  // Format price with currency symbol
  const formatPrice = (price, currency = "USD") => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      currencyDisplay: "code",
    });
    return formatter.format(price);
  };

  // Icon mapping function
  const getIconComponent = (iconName) => {
    const iconMap = {
      FaHome: <FaHome className="text-[#00386b] text-3xl md:text-4xl" />,
      FaBed: <FaBed className="text-[#00386b] text-3xl md:text-4xl" />,
      FaBath: <FaBath className="text-[#00386b] text-3xl md:text-4xl" />,
      FaParking: <FaParking className="text-[#00386b] text-3xl md:text-4xl" />,
      FaChair: <FaChair className="text-[#00386b] text-3xl md:text-4xl" />,
      FaTree: <FaTree className="text-[#00386b] text-3xl md:text-4xl" />,
      FaPaw: <FaPaw className="text-[#00386b] text-3xl md:text-4xl" />,
      FaWifi: <FaWifi className="text-[#00386b] text-3xl md:text-4xl" />,
      FaTv: <FaTv className="text-[#00386b] text-3xl md:text-4xl" />,
      FaSwimmingPool: (
        <FaSwimmingPool className="text-[#00386b] text-3xl md:text-4xl" />
      ),
      FaSnowflake: (
        <FaSnowflake className="text-[#00386b] text-3xl md:text-4xl" />
      ),
      FaUtensils: (
        <FaUtensils className="text-[#00386b] text-3xl md:text-4xl" />
      ),
      FaCar: <FaCar className="text-[#00386b] text-3xl md:text-4xl" />,
      FaShower: <FaShower className="text-[#00386b] text-3xl md:text-4xl" />,
      FaLock: <FaLock className="text-[#00386b] text-3xl md:text-4xl" />,
      FaLaptop: <FaLaptop className="text-[#00386b] text-3xl md:text-4xl" />,
      FaMountain: (
        <FaMountain className="text-[#00386b] text-3xl md:text-4xl" />
      ),
      FaToilet: <FaToilet className="text-[#00386b] text-3xl md:text-4xl" />,
    };

    return (
      iconMap[iconName] || (
        <FaHome className="text-[#00386b] text-3xl md:text-4xl" />
      )
    );
  };

  return (
    <main className="min-h-screen">
      {loading && <LoadingSpinner />}
      {error && <p className="text-center my-7 text-2xl">Algo salió mal</p>}
      {listing && !loading && !error && (
        <PageTransition isLoading={loading || !imagesLoaded}>
          <Swiper
            navigation
            className="sticky top-0 z-10"
            slidesPerView={1}
            spaceBetween={10}
            loop={true}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {listing.imageUrls.map((url, index) => (
              <SwiperSlide key={url}>
                <div
                  className="aspect-[4/3] w-full bg-center bg-no-repeat bg-cover cursor-pointer"
                  style={{ backgroundImage: `url(${url})` }}
                  onClick={() => handleImageClick(index)}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          {selectedImageIndex !== null && (
            <div
              className="fixed inset-0 bg-gray-500/60 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={handleCloseModal}
            >
              <div className="relative w-[90%] md:w-[80%] lg:max-w-4xl h-[90vh] flex items-center justify-center">
                <div className="relative max-w-full max-h-full">
                  <img
                    src={listing.imageUrls[selectedImageIndex]}
                    alt="Full size view"
                    className="max-w-full max-h-[85vh] object-contain border-4 border-white shadow-xl mx-auto"
                  />
                  <button
                    className="absolute top-4 right-4 bg-white rounded-full p-2 text-black hover:bg-gray-200"
                    onClick={handleCloseModal}
                  >
                    ✕
                  </button>

                  <button
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 text-black hover:bg-gray-200 shadow-md"
                    onClick={handlePrevImage}
                  >
                    ←
                  </button>
                  <button
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 text-black hover:bg-gray-200 shadow-md"
                    onClick={handleNextImage}
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[20%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Enlace copiado
            </p>
          )}

          <div className="flex flex-col max-w-6xl mx-auto p-3 my-4 md:my-7 gap-3 md:gap-4">
            <p className="text-3xl md:text-6xl font-semibold">{listing.name}</p>
            <div className="flex flex-col gap-2">
              {listing.offer ? (
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl md:text-4xl font-bold text-green-700">
                      {formatPrice(
                        listing.discountPrice,
                        listing.currency || "USD"
                      )}
                      {listing.type === "rent" && " / month"}
                    </span>
                    <span className="text-lg md:text-2xl text-gray-500 line-through">
                      {formatPrice(
                        listing.regularPrice,
                        listing.currency || "USD"
                      )}
                    </span>
                    <span className="bg-green-100 text-green-800 text-sm md:text-base px-2 py-1 rounded-md font-semibold">
                      {Math.round(
                        (1 - listing.discountPrice / listing.regularPrice) * 100
                      )}
                      % OFF
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <span className="text-2xl md:text-4xl font-bold">
                    {formatPrice(
                      listing.regularPrice,
                      listing.currency || "USD"
                    )}
                    {listing.type === "rent" && " / month"}
                  </span>
                </div>
              )}
            </div>
            <p className="flex items-center mt-3 md:mt-6 gap-2 text-slate-600 text-xl md:text-2xl">
              <FaMapMarkerAlt className="text-[#00386b]" />
              {listing.city ? (
                <span>
                  {listing.address} ({listing.city})
                </span>
              ) : (
                <span>{listing.address}</span>
              )}
            </p>
            <div className="flex flex-wrap gap-3 md:gap-4">
              {listing.status === "disponible" && (
                <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md text-lg md:text-xl">
                  {listing.type === "rent" ? "En Renta" : "En Venta"}
                </p>
              )}
              {listing.status === "vendida" && (
                <p className="bg-gray-700 w-full max-w-[200px] text-white text-center p-1 rounded-md text-lg md:text-xl">
                  VENDIDA
                </p>
              )}
              {listing.status === "rentada" && (
                <p className="bg-blue-700 w-full max-w-[200px] text-white text-center p-1 rounded-md text-lg md:text-xl">
                  RENTADA
                </p>
              )}
              {listing.status === "apartada" && (
                <p className="bg-yellow-700 w-full max-w-[200px] text-white text-center p-1 rounded-md text-lg md:text-xl">
                  APARTADA
                </p>
              )}
            </div>
            <div className="text-slate-800 mt-4 md:mt-6 text-lg md:text-xl text-justify">
              <span className="font-semibold text-black text-xl md:text-2xl block mb-1">
                Descripción
              </span>
              <div className="mt-2 md:leading-relaxed">
                {listing.description}
              </div>
            </div>
            {listing.youtubeUrl && (
              <div className="w-full mt-6">
                <div
                  className="relative w-full max-w-4xl mx-auto"
                  style={{ paddingBottom: "56.25%" }}
                >
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                    src={formatYoutubeUrl(listing.youtubeUrl)}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
            <hr className="mb-4" />

            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/4 md:pr-2">
                <span className="font-semibold text-black text-xl md:text-2xl block mb-4">
                  Características
                </span>
                <ul className="font-semibold flex flex-col items-start gap-4">
                  <li className="flex items-center gap-3 whitespace-nowrap">
                    <FaHome className="text-3xl md:text-4xl text-[#00386b]" />{" "}
                    <span className="text-lg md:text-xl">
                      {listing.category}
                    </span>
                  </li>
                  {listing.bedrooms > 0 && (
                    <li className="flex items-center gap-3 whitespace-nowrap">
                      <FaBed className="text-3xl md:text-4xl text-[#00386b]" />{" "}
                      <span className="text-lg md:text-xl">
                        {listing.bedrooms > 1
                          ? `${listing.bedrooms} Recámaras`
                          : "1 Recámara"}
                      </span>
                    </li>
                  )}
                  {listing.bathrooms > 0 && (
                    <li className="flex items-center gap-3 whitespace-nowrap">
                      <FaBath className="text-3xl md:text-4xl text-[#00386b]" />{" "}
                      <span className="text-lg md:text-xl">
                        {listing.bathrooms === 1
                          ? "1 Baño"
                          : `${listing.bathrooms} Baños`}
                      </span>
                    </li>
                  )}
                  {listing.constructionArea > 0 && (
                    <li className="flex items-center gap-3 whitespace-nowrap">
                      <FaRuler className="text-3xl md:text-4xl text-[#00386b]" />{" "}
                      <span className="text-lg md:text-xl">
                        {listing.constructionArea} m² construcción
                      </span>
                    </li>
                  )}
                  {listing.landArea > 0 && (
                    <li className="flex items-center gap-3 whitespace-nowrap">
                      <FaRuler className="text-3xl md:text-4xl text-[#00386b]" />{" "}
                      <span className="text-lg md:text-xl">
                        {listing.landArea} m² terreno
                      </span>
                    </li>
                  )}
                  {listing.parking && (
                    <li className="flex items-center gap-3 whitespace-nowrap">
                      <FaCar className="text-3xl md:text-4xl text-[#00386b]" />{" "}
                      <span className="text-lg md:text-xl">
                        {listing.parkingSpaces === 1
                          ? "1 Espacio"
                          : `${listing.parkingSpaces} Espacios`}
                      </span>
                    </li>
                  )}
                  {listing.furnished && (
                    <li className="flex items-center gap-3 whitespace-nowrap">
                      <FaChair className="text-3xl md:text-4xl text-[#00386b]" />{" "}
                      <span className="text-lg md:text-xl">Amueblado</span>
                    </li>
                  )}
                  {listing.type === "rent" && (
                    <li className="flex items-center gap-3 whitespace-nowrap">
                      <FaPaw className="text-3xl md:text-4xl text-[#00386b]" />{" "}
                      <span className="text-lg md:text-xl">
                        {listing.pets ? "Mascotas Permitidas" : "No Mascotas"}
                      </span>
                    </li>
                  )}
                  {listing.customCharacteristics &&
                    listing.customCharacteristics.length > 0 &&
                    listing.customCharacteristics.map(
                      (characteristic, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-3 whitespace-nowrap"
                        >
                          {getIconComponent(characteristic.icon)}
                          <span className="text-lg md:text-xl">
                            {characteristic.text}
                          </span>
                        </li>
                      )
                    )}
                </ul>
              </div>

              <div className="w-full md:w-2/4 rounded-lg flex items-center justify-center">
                {listing.latitude && listing.longitude ? (
                  <div className="w-full h-full">
                    <Map
                      initialLocation={{
                        lat: listing.latitude,
                        lng: listing.longitude,
                      }}
                      readOnly={true}
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 text-lg">
                    Location not available
                  </p>
                )}
              </div>

              <div className="w-full md:w-1/4 mt-6 md:mt-0">
                {listing.status && listing.status !== "disponible" ? (
                  <div className="bg-gray-100 p-6 rounded-lg text-center">
                    <p className="text-lg font-semibold text-gray-700">
                      Propiedad{" "}
                      {listing.status.charAt(0).toUpperCase() +
                        listing.status.slice(1)}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Esta propiedad ya no está disponible.
                    </p>
                  </div>
                ) : (
                  <ContactForm listingId={params.id} />
                )}
              </div>
            </div>
          </div>
        </PageTransition>
      )}
    </main>
  );
}
