import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ListingItem({ listing }) {
  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden rounded-lg w-full sm:w-[320px]">
      <Link to={`/listing/${listing._id}`} onClick={handleClick}>
        <img
          src={listing.imageUrls[0]}
          alt="imagen de portada"
          className="h-[320px] sm:h-[220px] w-full sm:w-[320px] object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="text-lg font-semibold text-slate-700 truncate">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-5 w-5 text-slate-700" />
            <p className="text-sm text-gray-600 line-clamp-2 w-full">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <div className="flex items-center gap-2">
            {listing.offer ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-green-700">
                  ${listing.discountPrice.toLocaleString("en-US")}
                  {listing.type === "rent" && " / mes"}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${listing.regularPrice.toLocaleString("en-US")}
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold text-slate-700">
                ${listing.regularPrice.toLocaleString("en-US")}
                {listing.type === "rent" && " / mes"}
              </span>
            )}
          </div>
          <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-xs">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Recámaras`
                : "1 Recámara"}
            </div>
            <div className="font-bold text-xs">
              {listing.bathrooms > 1 ? `${listing.bathrooms} Baños` : "1 Baño"}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
