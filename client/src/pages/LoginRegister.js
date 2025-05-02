import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const URL = process.env.REACT_APP_SERVER_URL;

const LoginRegister = ({ isDarkMode, toggleMode }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrorMessage("");
  };

  const handleLogin = async (e) => {
    try {
      e.preventDefault();

      const phoneNumber = e.target.phoneNumber.value.trim();
      const password = e.target.loginPassword.value.trim();

      if (!phoneNumber || !password) {
        setErrorMessage("Invalid phone number or password.");
        return;
      }

      const response = await axios.post(
        `${URL}/api/auth/signin`,
        { phoneNumber, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setTimeout(() => {
          window.location.reload();
          navigate("/");
        }, 500);
      }

    } catch (error) {
      console.log(error.response);
    }
  };
  const handleRegister = async (e) => {
    try {
      e.preventDefault();
      const firstName = e.target.registerFirstName.value;
      const lastName = e.target.registerLastName.value;
      const phoneNumber = e.target.phoneNumber.value;
      const password = e.target.registerPassword.value;

      const address = e.target.address.value;
      const zipCode = e.target.zipCode.value;
      const city = e.target.city.value;
      const country = e.target.country.value;

      if (password.length < 8) {
        setErrorMessage("Password must be at least 8 characters long.");
        return;
      }

      if (phoneNumber.length < 10) {
        setErrorMessage("Phone number must be at least 10 characters long.");
        return;
      }

      await axios.post(`${URL}/api/users`, {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        password: password,
        address: address,
        zipCode: zipCode,
        city: city,
        country: country,
      });

      setIsLogin(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`container py-5 ${isDarkMode ? "bg-dark text-light" : "bg-light text-dark"}`}
    >
      <div
        className="card shadow-lg"
        style={{ maxWidth: "500px", margin: "0 auto" }}
      >
        <div className="card-header text-center">
          <h3>{isLogin ? "Login" : "Register"}</h3>
        </div>

        <div className="card-body">
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}

          {isLogin ? (
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="phoneNumber" className="form-label">
                  Phone number
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter your phoneNumber"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="loginPassword" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="loginPassword"
                  name="loginPassword"
                  placeholder="Enter your password"
                  required
                  maxLength="50"
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label htmlFor="registerFirstName" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="registerFirstName"
                  name="registerFirstName"
                  placeholder="Enter your first name"
                  required
                  maxLength="50"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="registerLastName" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="registerLastName"
                  name="registerLastName"
                  placeholder="Enter your last name"
                  required
                  maxLength="50"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="phoneNumber" className="form-label">
                  Phone number
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter your phoneNumber"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="registerPassword" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="registerPassword"
                  name="registerPassword"
                  placeholder="Create a password"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  placeholder="Enter your address"
                  required
                  maxLength="50"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="zipCode" className="form-label">
                  Zip code
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="zipCode"
                  name="zipCode"
                  placeholder="Enter your zip code"
                  required
                  maxLength="50"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="city" className="form-label">
                  City
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="city"
                  name="city"
                  placeholder="Enter your city"
                  required
                  maxLength="50"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="country" className="form-label">
                  Country
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="country"
                  name="country"
                  placeholder="Enter your country"
                  required
                  maxLength="50"
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Register
              </button>
            </form>
          )}
        </div>

        <div className="card-footer text-center">
          <button className="btn btn-link" onClick={toggleForm}>
            {isLogin
              ? "Don't have an account? Register here."
              : "Already have an account? Login here."}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
