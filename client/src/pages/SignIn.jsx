import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import LoadingSpinner from "../components/LoadingSpinner";
import PageTransition from "../components/PageTransition";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pageLoading, setPageLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
      setContentReady(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen">
      {pageLoading && <LoadingSpinner />}

      {!pageLoading && (
        <PageTransition isLoading={!contentReady}>
          <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-xl sm:text-2xl text-center font-semibold my-4 sm:my-6">
              Sign In
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email"
                className="border-0 p-3 rounded-lg bg-white"
                id="email"
                onChange={handleChange}
              />
              <input
                type="password"
                placeholder="Password"
                className="border-0 p-3 rounded-lg bg-white"
                id="password"
                onChange={handleChange}
              />
              <button
                disabled={loading}
                className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-75"
              >
                {loading ? "Loading..." : "Sign In"}
              </button>
              <OAuth />
            </form>

            <div className="flex gap-2 mt-5">
              <p>Dont have a account?</p>
              <Link to="/signup">
                <span className="text-blue-700">Sign up</span>
              </Link>
            </div>
            {error && <p className="text-red-500 mt-5">{error}</p>}
          </div>
        </PageTransition>
      )}
    </div>
  );
}
