/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserProtectedWrapper = ({ children }) => {
  const { user, setUser } = useContext(UserDataContext);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken || !refreshToken) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/userprofile`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "x-refresh-token": refreshToken,
            },
          }
        );

        if (response.status === 200) {
          setUser(response.data.user);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
      }
    };

    checkAuth();
  }, []); 

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return <>{children}</>;
};

export default UserProtectedWrapper;
