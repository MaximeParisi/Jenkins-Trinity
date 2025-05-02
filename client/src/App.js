import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useCallback, useEffect, useState } from "react";
import {
  Route,
  Routes,
  useLocation,
  useNavigate
} from "react-router-dom";
import Navigation from "./components/Navigation";
import AccountManagement from "./pages/AccountManagement";
import AccountManager from "./pages/AccountManager";
import AllInvoice from "./pages/AllInvoices";
import Cart from "./pages/Cart";
import Fournisseur from "./pages/Fournisseur";
import HistoryPurchase from "./pages/HistoryPurchase";
import Home from "./pages/Home";
import LoginRegister from "./pages/LoginRegister";
import Paiement from "./pages/Paiement";
import Product from "./pages/Product";
import Scanner from "./pages/Scanner";

const URL = process.env.REACT_APP_SERVER_URL;
const REACT_APP_PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID;

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMode = () => setIsDarkMode(!isDarkMode);

  const handleGetUserInfo = useCallback(async () => {
    try {
      const response = await axios.get(`${URL}/api/users/me`, {
        withCredentials: true
      });

      setIsLoggedIn(true);
      const role = response.data.user.roles.some(r => ['ROLE_ADMIN', 'admin'].includes(r.name)) ? 'admin' : 'user';
      setRole(role);
    } catch (error) {
      console.error("Erreur lors de la récupération du rôle :", error);
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && location.pathname === "/loginRegister") {
      // Add a small delay to avoid rapid navigation
      const timer = setTimeout(() => navigate("/"), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, location.pathname, navigate]);

  useEffect(() => {
    handleGetUserInfo();
  }, [handleGetUserInfo]);

  const SafeRedirect = ({ to }) => {
    const navigate = useNavigate();

    useEffect(() => {
      const timer = setTimeout(() => navigate(to), 100);
      return () => clearTimeout(timer);
    }, [to, navigate]);

    return null;
  };

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (isLoggedIn === false) {
      return <SafeRedirect to="/loginRegister" />;
    }
    if (!allowedRoles.includes(role)) {
      return <SafeRedirect to="/" />;
    }
    return children;
  };

  return (
    <div className={`min-vh-100 ${isDarkMode ? "bg-dark text-light" : "bg-light text-dark"}`}>

      <Navigation
        isLoggedIn={isLoggedIn}
        role={role}
        toggleMode={toggleMode}
        isDarkMode={isDarkMode}
        setIsLoggedIn={setIsLoggedIn}
        setRole={setRole}
      />

      <div className="container">
        <Routes>
          <Route path="/loginRegister" element={<LoginRegister />} />
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <PayPalScriptProvider options={{ "client-id": REACT_APP_PAYPAL_CLIENT_ID }}>
                  <Cart />
                </PayPalScriptProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/historyPurchase"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <HistoryPurchase />
              </ProtectedRoute>
            }
          />
          <Route
            path="/paiement"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <Paiement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accountManagement"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <AccountManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accountManager"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AccountManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <Product
                  role={role} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoices"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AllInvoice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scanner"
            element={
              // <ProtectedRoute allowedRoles={["admin"]}>
                <Scanner />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/fournisseur"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Fournisseur />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
