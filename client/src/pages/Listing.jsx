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
} from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";
import PageTransition from "../components/PageTransition";

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

  return (
    <main className="min-h-screen">
      {loading && <LoadingSpinner />}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong</p>
      )}
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
              Link copied
            </p>
          )}

          <div className="flex flex-col max-w-6xl mx-auto p-3 my-4 md:my-7 gap-3 md:gap-4">
            <p className="text-3xl md:text-6xl font-semibold">{listing.name}</p>
            <div className="flex items-center gap-2">
              {listing.offer ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl md:text-4xl font-bold text-green-700">
                    ${listing.discountPrice.toLocaleString("en-US")}
                    {listing.type === "rent" && " / month"}
                  </span>
                  <span className="text-lg md:text-2xl text-gray-500 line-through">
                    ${listing.regularPrice.toLocaleString("en-US")}
                  </span>
                  <span className="bg-green-100 text-green-800 text-sm md:text-base px-2 py-1 rounded-md font-semibold">
                    {Math.round(
                      (1 - listing.discountPrice / listing.regularPrice) * 100
                    )}
                    % OFF
                  </span>
                </div>
              ) : (
                <span className="text-2xl md:text-4xl font-bold">
                  ${listing.regularPrice.toLocaleString("en-US")}
                  {listing.type === "rent" && " / month"}
                </span>
              )}
            </div>
            <p className="flex items-center mt-3 md:mt-6 gap-2 text-slate-600 text-xl md:text-2xl">
              <FaMapMarkerAlt className="text-[#00386b]" />
              {listing.address}
            </p>
            <div className="flex flex-wrap gap-3 md:gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md text-lg md:text-xl">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
            </div>
            <div className="text-slate-800 mt-4 md:mt-6 text-lg md:text-xl text-justify">
              <span className="font-semibold text-black text-xl md:text-2xl block mb-1">
                Description
              </span>
              <div className="mt-2 md:leading-relaxed">
                {listing.description}
              </div>
            </div>
            <hr className="my-4" />

            <div className="flex flex-col md:flex-row gap-5 md:gap-3 mt-2">
              <div className="w-full md:w-1/4 md:pr-2">
                <span className="font-semibold text-black text-xl md:text-2xl block mb-4">
                  Characteristics
                </span>
                <ul className="font-semibold flex flex-col items-start gap-4">
                  <li className="flex items-center gap-3 whitespace-nowrap">
                    <FaBed className="text-3xl md:text-4xl text-[#00386b]" />{" "}
                    <span className="text-lg md:text-xl">
                      {listing.bedrooms > 1
                        ? `${listing.bedrooms} Bedrooms`
                        : "1 Bedroom"}
                    </span>
                  </li>
                  <li className="flex items-center gap-3 whitespace-nowrap">
                    <FaBath className="text-3xl md:text-4xl text-[#00386b]" />{" "}
                    <span className="text-lg md:text-xl">
                      {listing.bathrooms > 1
                        ? `${listing.bathrooms} Bathrooms`
                        : "1 Bathroom"}
                    </span>
                  </li>
                  <li className="flex items-center gap-3 whitespace-nowrap">
                    <FaParking className="text-3xl md:text-4xl text-[#00386b]" />{" "}
                    <span className="text-lg md:text-xl">
                      {listing.parking ? "Parking Available" : "No Parking"}
                    </span>
                  </li>
                  <li className="flex items-center gap-3 whitespace-nowrap">
                    <FaChair className="text-3xl md:text-4xl text-[#00386b]" />{" "}
                    <span className="text-lg md:text-xl">
                      {listing.furnished ? "Furnished" : "Unfurnished"}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="w-full md:w-3/4 bg-gray-200 rounded-lg min-h-[200px] md:min-h-[300px] flex items-center justify-center mt-2 md:mt-0 md:pl-2">
                <p className="text-gray-500 text-lg">Google Maps</p>
              </div>
            </div>
          </div>
        </PageTransition>
      )}
    </main>
  );
}
