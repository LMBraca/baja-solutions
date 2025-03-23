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

// Common country codes for dropdown
const countryCodes = [
  { code: "+1", country: "US/Canada" },
  { code: "+44", country: "UK" },
  { code: "+52", country: "Mexico" },
  { code: "+33", country: "France" },
  { code: "+49", country: "Germany" },
  { code: "+34", country: "Spain" },
  { code: "+39", country: "Italy" },
  { code: "+81", country: "Japan" },
  { code: "+86", country: "China" },
  { code: "+91", country: "India" },
  { code: "+55", country: "Brazil" },
  { code: "+61", country: "Australia" },
];

export default function Profile() {
  const [formData, setFormData] = useState({});
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [inviteError, setInviteError] = useState(null);
  const [phoneNumberParts, setPhoneNumberParts] = useState({
    areaCode: "+1",
    number: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
      setContentReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (currentUser?.phoneNumber) {
      // Try to parse the phone number into area code and number
      const match = currentUser.phoneNumber.match(/^(\+\d+)\s+(.+)$/);
      if (match) {
        setPhoneNumberParts({
          areaCode: match[1],
          number: match[2],
        });
      }
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handlePhoneChange = (e) => {
    setPhoneNumberParts({
      ...phoneNumberParts,
      [e.target.id]: e.target.value,
    });

    // Update the formData with the full phone number
    setFormData({
      ...formData,
      phoneNumber: `${
        e.target.id === "areaCode" ? e.target.value : phoneNumberParts.areaCode
      } ${e.target.id === "number" ? e.target.value : phoneNumberParts.number}`,
    });
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

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      setInviteLoading(true);
      setInviteError(null);

      const res = await fetch("/api/user/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inviteEmail,
          adminName: currentUser.username,
          adminEmail: currentUser.email,
        }),
      });

      const data = await res.json();

      if (data.success === false) {
        setInviteError(data.message);
        setInviteLoading(false);
        return;
      }

      setInviteSuccess(true);
      setInviteEmail("");
      setInviteLoading(false);

      setTimeout(() => {
        setInviteSuccess(false);
      }, 3000);
    } catch (error) {
      setInviteError(error.message);
      setInviteLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {pageLoading && <LoadingSpinner />}

      {!pageLoading && (
        <PageTransition isLoading={!contentReady}>
          <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm">Username</label>
                <input
                  type="text"
                  placeholder="username"
                  id="username"
                  className="border p-3 rounded-lg"
                  defaultValue={currentUser.username}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm">Email</label>
                <input
                  type="email"
                  placeholder="email"
                  id="email"
                  className="border p-3 rounded-lg"
                  defaultValue={currentUser.email}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm">Phone Number</label>
                <div className="flex gap-2">
                  <select
                    id="areaCode"
                    className="border p-3 rounded-lg w-1/3"
                    value={phoneNumberParts.areaCode}
                    onChange={handlePhoneChange}
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.code} ({country.country})
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    placeholder="Phone number"
                    id="number"
                    className="border p-3 rounded-lg flex-1"
                    value={phoneNumberParts.number}
                    onChange={handlePhoneChange}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  id="password"
                  className="border p-3 rounded-lg"
                  onChange={handleChange}
                />
              </div>

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

            <div className="mt-10 p-3 max-w-lg mx-auto">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Invite Administrator
              </h2>
              <form onSubmit={handleInvite} className="flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="border-0 p-3 rounded-lg bg-white"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
                <button
                  disabled={inviteLoading}
                  className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-75"
                >
                  {inviteLoading ? "Sending..." : "Send Invitation"}
                </button>
              </form>

              {inviteSuccess && (
                <p className="text-green-500 mt-5">
                  Invitation sent successfully!
                </p>
              )}

              {inviteError && (
                <p className="text-red-500 mt-5">{inviteError}</p>
              )}
            </div>
          </div>
        </PageTransition>
      )}
    </div>
  );
}
