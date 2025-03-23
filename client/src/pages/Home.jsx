import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import LoadingSpinner from "../components/LoadingSpinner";
import PageTransition from "../components/PageTransition";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [sellListings, setSellListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/?offer=true&limit=3");
        const data = await res.json();
        setOfferListings(data);
      } catch (error) {
        console.error("Error fetching offer listings:", error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/?type=rent&limit=3");
        const data = await res.json();
        setRentListings(data);
      } catch (error) {
        console.error("Error fetching rent listings:", error);
      }
    };

    const fetchSellListings = async () => {
      try {
        const res = await fetch("/api/listing/?type=sell&limit=3");
        const data = await res.json();
        setSellListings(data);
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

  console.log(offerListings);

  return (
    <div className="min-h-screen">
      {loading && <LoadingSpinner />}

      {!loading && (
        <PageTransition isLoading={!contentReady}>
          <div>
            <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
              <h1 className="text-slate-700 text-3xl font-bold lg:text-6xl">
                Find your next <span className="text-slate-500">perfect</span>
                <br />
                place with ease
              </h1>
              <div className="text-gray-400 text-xs sm:text-sm">
                Baja Solutions si the best place to find your next home
                <br />
                We have a wide range of properties for you to choose from
              </div>
              <Link
                to="/search"
                className="text-xs sm:text-sm text-blue-800 font-bold hover:underline cursor-pointer"
              >
                Lets get started...
              </Link>
            </div>
            <Swiper navigation>
              {offerListings &&
                offerListings.length > 0 &&
                offerListings.map((listing, index) => (
                  <SwiperSlide key={listing._id}>
                    <div
                      style={{
                        background: `url(${listing.imageUrls[0]}) center`,
                        backgroundSize: "cover",
                      }}
                      className="h-[500px]"
                    ></div>
                  </SwiperSlide>
                ))}
            </Swiper>

            <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
              {offerListings && offerListings.length > 0 && (
                <div>
                  <div className="my-3">
                    <h2 className="text-2xl font-semibold text-slate-600">
                      Recent Offers
                    </h2>
                    <Link
                      to="/search?offer=true"
                      className="text-blue-800 text-sm hover:underline"
                    >
                      Show more
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {offerListings.map((listing) => (
                      <ListingItem listing={listing} key={listing._id} />
                    ))}
                  </div>
                </div>
              )}

              {rentListings && rentListings.length > 0 && (
                <div>
                  <div className="my-3">
                    <h2 className="text-2xl font-semibold text-slate-600">
                      Recent places for Rent
                    </h2>
                    <Link
                      to="/search?type=rent"
                      className="text-blue-800 text-sm hover:underline"
                    >
                      Show more places for rent
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {rentListings.map((listing) => (
                      <ListingItem listing={listing} key={listing._id} />
                    ))}
                  </div>
                </div>
              )}

              {sellListings && sellListings.length > 0 && (
                <div>
                  <div className="my-3">
                    <h2 className="text-2xl font-semibold text-slate-600">
                      Recent places for Sale
                    </h2>
                    <Link
                      to="/search?type=sell"
                      className="text-blue-800 text-sm hover:underline"
                    >
                      Show more places for sale
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-4">
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
