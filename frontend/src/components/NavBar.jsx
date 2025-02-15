import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
   

  return (
    <nav className="bg-blue-600 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex justify-center items-center">
            {/* Placeholder for your logo */}
            <span className="text-xl font-bold text-blue-600">Logo</span>
          </div>
          <h1 className="text-2xl text-white font-semibold">ApireAI</h1>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-gray-200">
            Home
          </Link>
          <Link to="/career-library" className="text-white hover:text-gray-200">
            Career Library
          </Link>
          <Link to="/about" className="text-white hover:text-gray-200">
            About Us
          </Link>
          <Link to="/services" className="text-white hover:text-gray-200">
            Services
          </Link>
          <Link to="/contact" className="text-white hover:text-gray-200">
            Contact
          </Link>
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-4">
          <button className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200">
            Log In
          </button>
          <button className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200">
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Button */}
        {/* <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => console.log("Toggle Mobile Menu")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button> */}
      </div>
    </nav>
  );
};

export default Navbar;
