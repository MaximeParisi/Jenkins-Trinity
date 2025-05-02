import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LogoutButton = ({ setIsLoggedIn, setRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    document.cookie =
      "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("accessToken");
    axios.defaults.headers.common["x-access-token"] = null;
    setIsLoggedIn(false);
    setRole("");
    navigate("/LoginRegister");
  };

  return (
    <button className="btn btn-danger" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
