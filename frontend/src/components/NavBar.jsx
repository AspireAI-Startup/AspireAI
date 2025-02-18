import { useContext } from "react";
import { UserDataContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const NavBar = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(UserDataContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/logout`,
        { accessToken, refreshToken },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.status === 201) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsLoggedIn(false);
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  return (
    <nav className="bg-blue-600 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl text-white font-semibold">ApireAI</h1>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-gray-200">Home</Link>
          <Link to="/career-library" className="text-white hover:text-gray-200">Career Library</Link>
          <Link to="/about" className="text-white hover:text-gray-200">About Us</Link>
          <Link to="/services" className="text-white hover:text-gray-200">Services</Link>
          <Link to="/contact" className="text-white hover:text-gray-200">Contact</Link>
        </div>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <button className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200" onClick={handleLogout}>
              Log Out
            </button>
          ) : (
            <>
              <Link to="/login">
                <button className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200">
                  Log In
                </button>
              </Link>
              <Link to="/register">
                <button className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
