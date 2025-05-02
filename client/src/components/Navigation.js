import React from "react";
import { FaIndustry, FaProductHunt, FaShoppingCart, FaUser, FaUsers } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const Navigation = ({ isLoggedIn, role, toggleMode, isDarkMode, setIsLoggedIn, setRole }) => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4 shadow-sm">
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold text-white" to="/">
                    <strong>Trinity Backoffice</strong>
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {isLoggedIn && role === "user" && (
                            <>
                                <li className="nav-item me-3">
                                    <Link
                                        className={`nav-link fw-bold px-3 rounded ${isActive("/Cart") ? "bg-white text-primary" : "text-white"}`}
                                        to="/cart"
                                    >
                                        <FaShoppingCart className="me-2" /> Cart
                                    </Link>
                                </li>
                                <li className="nav-item me-3">
                                    <Link
                                        className={`nav-link fw-bold px-3 rounded ${isActive("/scanner") ? "bg-white text-primary" : "text-white"}`}
                                        to="/scanner"
                                    >
                                        <FaIndustry className="me-2" /> Scanner
                                    </Link>
                                </li>
                                <li className="nav-item me-3">
                                    <Link
                                        className={`nav-link fw-bold px-3 rounded ${isActive("/AccountManagement") ? "bg-white text-primary" : "text-white"}`}
                                        to="/accountManagement"
                                    >
                                        <FaUser className="me-2" /> Your Account
                                    </Link>
                                </li>
                            </>
                        )}
                        {isLoggedIn && role === "admin" && (
                            <>
                                <li className="nav-item me-3">
                                    <Link
                                        className={`nav-link fw-bold px-3 rounded ${isActive("/Product") ? "bg-white text-primary" : "text-white"}`}
                                        to="/product"
                                    >
                                        <FaProductHunt className="me-2" /> Products
                                    </Link>
                                </li>
                                <li className="nav-item me-3">
                                    <Link
                                        className={`nav-link fw-bold px-3 rounded ${isActive("/Fournisseur") ? "bg-white text-primary" : "text-white"}`}
                                        to="/fournisseur"
                                    >
                                        <FaIndustry className="me-2" /> Supplier
                                    </Link>
                                </li>
                                <li className="nav-item me-3">
                                    <Link
                                        className={`nav-link fw-bold px-3 rounded ${isActive("/Fournisseur") ? "bg-white text-primary" : "text-white"}`}
                                        to="/invoices"
                                    >
                                        <FaIndustry className="me-2" /> Invoices
                                    </Link>
                                </li>
                                <li className="nav-item me-3">
                                    <Link
                                        className={`nav-link fw-bold px-3 rounded ${isActive("/AccountManager") ? "bg-white text-primary" : "text-white"}`}
                                        to="/accountManager"
                                    >
                                        <FaUsers className="me-2" /> Account Manager
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>

                    <div className="d-flex align-items-center">
                        {isLoggedIn && (
                            <LogoutButton setIsLoggedIn={setIsLoggedIn} setRole={setRole} />
                        )}
                        <button className="btn btn-outline-light ms-3" onClick={toggleMode}>
                            {isDarkMode ? "Light Mode" : "Dark Mode"}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
