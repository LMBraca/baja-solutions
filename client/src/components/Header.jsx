import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    navigate(`/search?${urlParams.toString()}`);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [window.location.search]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when changing route
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="bg-white shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold test-sm sm:text-xl flex items-center">
            <img src={logo} alt="logo" className="w-8 h-8 sm:w-10 sm:h-10" />
            <div className="flex flex-col">
              <span className="bajasolutions-logo-text text-center pl-2 sm:pl-5 pb-1 text-xs sm:text-2xl font-extrabold">
                BAJA SOLUTIONS
              </span>
              <span className="bajasolutions-logo-text text-center px-2 sm:px-3 -mt-1 sm:-mt-3 pl-2 sm:pl-5 text-[6px] sm:text-base font-light tracking-[0.3em]">
                REAL ESTATE
              </span>
            </div>
          </h1>
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          {location.pathname !== "/" && (
            <button
              onClick={() => navigate("/search")}
              className="p-2 rounded-lg text-slate-700"
            >
              <FaSearch />
            </button>
          )}
          <button
            onClick={toggleMenu}
            className="p-2 rounded-lg text-slate-700"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Desktop search */}
        {location.pathname !== "/" && (
          <form
            className="hidden md:flex bg-slate-100 p-3 rounded-lg items-center"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Buscar"
              className="bg-transparent focus:outline-none w-24 sm:w-64 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="hover:bg-slate-200 p-2 rounded-lg cursor-pointer">
              <FaSearch className="text-slate-600" />
            </button>
          </form>
        )}

        {/* Desktop navigation */}
        <ul className="hidden md:flex gap-4">
          <Link to="/">
            <li className="text-slate-700 hover:underline">Inicio</li>
          </Link>
          <Link to="/About">
            <li className="text-slate-700 hover:underline">Acerca de</li>
          </Link>
          <Link to="/sell">
            <li className="text-slate-700 hover:underline">Vender Propiedad</li>
          </Link>
          {currentUser && (
            <Link to="/profile">
              <li className="text-slate-700 hover:underline text-center">
                {currentUser.username}
              </li>
            </Link>
          )}
        </ul>
      </div>

      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-2 px-4 shadow-lg">
          {location.pathname !== "/" && (
            <form
              className="bg-slate-100 p-2 rounded-lg flex items-center mb-3"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                placeholder="Buscar"
                className="bg-transparent focus:outline-none w-full text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="hover:bg-slate-200 p-2 rounded-lg cursor-pointer">
                <FaSearch className="text-slate-600" />
              </button>
            </form>
          )}
          <ul className="flex flex-col gap-3">
            <Link to="/">
              <li className="text-slate-700 hover:underline py-2 border-b">
                Inicio
              </li>
            </Link>
            <Link to="/About">
              <li className="text-slate-700 hover:underline py-2 border-b">
                Acerca de
              </li>
            </Link>
            <Link to="/sell">
              <li className="text-slate-700 hover:underline py-2 border-b">
                Vender Propiedad
              </li>
            </Link>
            {currentUser && (
              <Link to="/profile">
                <li className="text-slate-700 hover:underline py-2">
                  {currentUser.username}
                </li>
              </Link>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
