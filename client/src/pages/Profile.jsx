import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import PageTransition from "../components/PageTransition";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutStart,
  signoutSuccess,
  signoutFailure,
} from "../redux/user/userSlice";

export default function Profile() {
  const [formData, setFormData] = useState({});
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
      setContentReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setUpdateSuccess(false);
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutFailure(data.message));
        return;
      }
      dispatch(signoutSuccess(data));
    } catch (error) {
      dispatch(signoutFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(data.message);
        return;
      }
      setUserListings(data);
      setShowListingsError(false);
    } catch (error) {
      setShowListingsError(error.message);
    }
  };

  const handleListingDelete = async (id) => {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(data.message);
        return;
      }
      setUserListings(userListings.filter((listing) => listing._id !== id));
      setShowListingsError(false);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="min-h-screen">
      {pageLoading && <LoadingSpinner />}

      {!pageLoading && (
        <PageTransition isLoading={!contentReady}>
          <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="username"
                id="username"
                className="border p-3 rounded-lg"
                defaultValue={currentUser.username}
                onChange={handleChange}
              />
              <input
                type="email"
                placeholder="email"
                id="email"
                className="border p-3 rounded-lg"
                defaultValue={currentUser.email}
                onChange={handleChange}
              />
              <input
                type="password"
                placeholder="password"
                id="password"
                className="border p-3 rounded-lg"
                defaultValue={currentUser.password}
                onChange={handleChange}
              />
              <button
                className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
                disabled={loading}
              >
                {loading ? "Loading..." : "Update"}
              </button>
              <Link
                to={"/create-listing"}
                className="text-white bg-green-700 p-3 rounded-lg uppercase text-center hover:opacity-95"
              >
                Create Listing
              </Link>
            </form>
            <div className="flex justify-between mt-5">
              <span
                className="text-red-700 cursor-pointer"
                onClick={handleDelete}
              >
                Delete Account
              </span>
              <span
                className="text-red-700 cursor-pointer"
                onClick={handleSignOut}
              >
                Sign Out
              </span>
            </div>
            <p className="text-red-700 mt-5">{error ? error : ""}</p>
            <p className="text-green-700 mt-5">
              {updateSuccess ? "Profile updated successfully" : ""}
            </p>
            <button
              className="text-green-700 w-full"
              onClick={handleShowListings}
            >
              Show Listings
            </button>
            <p className="text-red-700 mt-5">
              {showListingsError ? "Error showing listings" : ""}
            </p>

            {userListings && userListings.length > 0 && (
              <div className="flex flex-col gap-4">
                <h1 className="text-center text-2xl mt-7 font-semibold">
                  Your Listings
                </h1>
                {userListings.map((listing) => (
                  <div
                    key={listing._id}
                    className="border rounded-lg p-3 flex justify-between items-center gap-4"
                  >
                    <Link to={`/listing/${listing._id}`}>
                      <img
                        src={listing.imageUrls[0]}
                        alt="listing cover"
                        className="h-16 w-16 object-contain"
                      />
                      <div className="flex flex-col gap-2"></div>
                    </Link>
                    <Link
                      className="text-slate-700 font-semibold flex-1 hover:underline truncate"
                      to={`/listing/${listing._id}`}
                    >
                      <p>{listing.name}</p>
                    </Link>
                    <div className="flex flex-col item-center">
                      <button
                        className="text-red-700 uppercase hover:underline"
                        onClick={() => handleListingDelete(listing._id)}
                      >
                        Delete
                      </button>
                      <Link to={`/update-listing/${listing._id}`}>
                        <button className="text-green-700 uppercase hover:underline">
                          Edit
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </PageTransition>
      )}
    </div>
  );
}
