import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const URL = process.env.REACT_APP_SERVER_URL
axios.defaults.withCredentials = true;

const AccountManagement = () => {
  const navigate = useNavigate();

  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    password: '',
    billingAddress: {
      address: '',
      zipCode: '',
      city: '',
      country: ''
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('billingAddress.')) {
      const key = name.split('.')[1];
      setPersonalInfo((prev) => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [key]: value,
        },
      }));
    } else {
      setPersonalInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleGetUserInfo = useCallback(async () => {
    try {
      const response = await axios.get(`${URL}/api/users/me`, {
        withCredentials: true // 👈 ça c’est la clé !
      });
      setPersonalInfo(response.data.user);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleSaveChanges = async () => {
    try {
      await axios.put(
        `${URL}/api/users`,
        {
          firstName: personalInfo.firstName,
          lastName: personalInfo.lastName,
          phoneNumber: personalInfo.phoneNumber,
          password: personalInfo.password,
          billingAddress: personalInfo.billingAddress,
        }
      );
      alert('Changes saved successfully!');
      handleGetUserInfo();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (personalInfo.firstName === '') {
      handleGetUserInfo();
    }
  }, [handleGetUserInfo, personalInfo.firstName]);

  return (
    <div className="container py-5">
      <h2 className="mb-4">Account Management</h2>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="card-title">Personal Information</h4>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="firstName" className="form-label">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="form-control"
                value={personalInfo.firstName}
                onChange={handleInputChange}
                maxLength="50"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="lastName" className="form-label">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="form-control"
                value={personalInfo.lastName}
                onChange={handleInputChange}
                maxLength="50"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                className="form-control"
                value={personalInfo.phoneNumber}
                onChange={handleInputChange}
                maxLength="20"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={personalInfo.password}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="card-title">Billing Address</h4>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="billingAddress.address" className="form-label">Address</label>
              <input
                type="text"
                id="billingAddress.address"
                name="billingAddress.address"
                className="form-control"
                value={personalInfo.billingAddress.address}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="billingAddress.zipCode" className="form-label">Zip Code</label>
              <input
                type="text"
                id="billingAddress.zipCode"
                name="billingAddress.zipCode"
                className="form-control"
                value={personalInfo.billingAddress.zipCode}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="billingAddress.city" className="form-label">City</label>
              <input
                type="text"
                id="billingAddress.city"
                name="billingAddress.city"
                className="form-control"
                value={personalInfo.billingAddress.city}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="billingAddress.country" className="form-label">Country</label>
              <input
                type="text"
                id="billingAddress.country"
                name="billingAddress.country"
                className="form-control"
                value={personalInfo.billingAddress.country}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between">
        <button className="btn btn-primary me-3" onClick={handleSaveChanges}>
          Save Changes
        </button>
        <button className="btn btn-danger" onClick={() => navigate('/LoginRegister')}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AccountManagement;
