import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import React from "react";
import logo from "../assets/logo.png";
import { useSelector } from "react-redux";

export default function Header() {
  const {currentUser} = useSelector((state) => state.user);
  return (
    <header className="header-bg shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold test-sm sm:text-xl flex items-center">
            <img src={logo} alt="logo" className="w-10 h-10 sm:w-15 sm:h-15" />
            <div className="flex flex-col">
              <span className="bajasolutions-logo-text text-center pl-3 sm:pl-5 pb-1 text-xs sm:text-2xl font-extrabold">
                BAJA SOLUTIONS
              </span>
              <span className="bajasolutions-logo-text text-center px-2 sm:px-3 -mt-1 sm:-mt-3 pl-3 sm:pl-5 text-[8px] sm:text-base font-light tracking-[0.3em]">
                REAL ESTATE
              </span>
            </div>
          </h1>
        </Link>
        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Buscar"
            className="bg-transparent focus:outline-none w-24 sm:w-64 text-sm"
          />
          <FaSearch className="text-slate-600" />
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/About">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          {currentUser ? (
            <Link to="/profile">
              <li className="text-slate-700 hover:underline text-center">
                {currentUser.username}
              </li>
            </Link>
          ) : (
            <Link to="/signin">
              <li className="text-slate-700 hover:underline">Sign In</li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
}
