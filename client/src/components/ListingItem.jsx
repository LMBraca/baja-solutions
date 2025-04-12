import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
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

export default function ListingItem({ listing }) {
  const handleClick = () => {
    window.scrollTo(0, 0);
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
      FaHome: <FaHome />,
      FaBed: <FaBed />,
      FaBath: <FaBath />,
      FaParking: <FaParking />,
      FaChair: <FaChair />,
      FaTree: <FaTree />,
      FaPaw: <FaPaw />,
      FaWifi: <FaWifi />,
      FaTv: <FaTv />,
      FaSwimmingPool: <FaSwimmingPool />,
      FaSnowflake: <FaSnowflake />,
      FaUtensils: <FaUtensils />,
      FaCar: <FaCar />,
      FaShower: <FaShower />,
      FaLock: <FaLock />,
      FaLaptop: <FaLaptop />,
      FaMountain: <FaMountain />,
      FaToilet: <FaToilet />,
    };

    return iconMap[iconName] || <FaHome />;
  };

  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden rounded-lg w-full sm:w-[320px] relative">
      <Link to={`/listing/${listing._id}`} onClick={handleClick}>
        <div className="relative">
          {listing.status && listing.status !== "disponible" && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-gray-700 opacity-60"></div>
              <span
                className={`font-bold text-white text-xl md:text-2xl transform rotate-[-30deg] z-20 ${
                  listing.status === "vendida"
                    ? "text-red-200"
                    : listing.status === "rentada"
                    ? "text-blue-200"
                    : listing.status === "apartada"
                    ? "text-yellow-200"
                    : ""
                }`}
              >
                {listing.status === "vendida" && "VENDIDA"}
                {listing.status === "rentada" && "RENTADA"}
                {listing.status === "apartada" && "APARTADA"}
              </span>
            </div>
          )}
          <img
            src={listing.imageUrls[0]}
            alt="imagen de portada"
            className="h-[320px] sm:h-[220px] w-full sm:w-[320px] object-cover hover:scale-105 transition-scale duration-300"
          />
        </div>
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="text-lg font-semibold text-slate-700 truncate">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-5 w-5 text-slate-700" />
            <p className="text-sm text-gray-600 line-clamp-2 w-full">
              {listing.city ? (
                <span>
                  {listing.address} ({listing.city})
                </span>
              ) : (
                <span>{listing.address}</span>
              )}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            {listing.offer ? (
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-green-700">
                    {formatPrice(
                      listing.discountPrice,
                      listing.currency || "USD"
                    )}
                    {listing.type === "rent" && " / mes"}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(
                      listing.regularPrice,
                      listing.currency || "USD"
                    )}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-700">
                  {formatPrice(listing.regularPrice, listing.currency || "USD")}
                  {listing.type === "rent" && " / mes"}
                </span>
              </div>
            )}
          </div>
          <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-xs">{listing.category}</div>
            <div className="font-bold text-xs">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Recámaras`
                : "1 Recámara"}
            </div>
            <div className="font-bold text-xs">
              {listing.bathrooms === 1
                ? "1 Baño"
                : `${listing.bathrooms} Baños`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
