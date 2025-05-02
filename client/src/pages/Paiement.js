import React, { useState } from 'react';
import axiosInstance from '../api_services/axiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';

const Payment = ({ cartItems }) => {
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    zipCode: '',
    city: '',
    country: '',
  });
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    const { firstName, lastName, address, zipCode, city, country, phoneNumber } = billingInfo;

    // Vérifiez que toutes les informations de facturation sont remplies
    if (!firstName || !lastName || !address || !zipCode || !city || !country) {
      alert('Please fill out all billing information.');
      return;
    }

    try {
      // Préparez les données pour la facture
      const invoiceData = {
        customer: {
          firstName,
          lastName,
          phoneNumber,
          billingAddress: {
            address,
            zipCode,
            city,
            country,
          },
        },
        products: cartItems.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: calculateTotal(),
      };

      const response = await axiosInstance.post('/invoices', invoiceData);

      if (response.status === 201) {
        console.log('Invoice created successfully:', response.data);

        setTimeout(() => {
          setIsPaymentSuccessful(true);
        }, 1000);
      } else {
        throw new Error('Failed to create invoice');
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('An error occurred while processing your payment.');
    }
  };

  if (isPaymentSuccessful) {
    return (
      <div className="container py-5 text-center">
        <h2>Payment Successful!</h2>
        <p>Thank you for your purchase.</p>
        <button
          className="btn btn-primary"
          onClick={() => (window.location.href = '/')}
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2>Payment</h2>

      <div className="mb-4">
        <h4>Order Summary</h4>
        {cartItems.map((item, index) => (
          <div key={`summary-${item.id}-${index}`} className="row mb-2">
            <div className="col-6">{item.name} (x{item.quantity})</div>
            <div className="col-6 text-end">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}

        <hr />
        <div className="text-end">
          <h5>Total: ${calculateTotal()}</h5>
        </div>
      </div>

      <div className="mb-4">
        <h4>Billing Information</h4>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className="form-control"
            value={billingInfo.firstName}
            onChange={handleInputChange}
            maxLength="50"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="form-control"
            value={billingInfo.lastName}
            onChange={handleInputChange}
            maxLength="50"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            className="form-control"
            value={billingInfo.address}
            onChange={handleInputChange}
            maxLength="50"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="postalCode" className="form-label">
            zipCode
          </label>
          <input
            type="text"
            id="postalCode"
            name="zipCode"
            className="form-control"
            value={billingInfo.zipCode}
            onChange={handleInputChange}
            maxLength="50"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="city" className="form-label">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            className="form-control"
            value={billingInfo.city}
            onChange={handleInputChange}
            maxLength="50"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="country" className="form-label">
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            className="form-control"
            value={billingInfo.country}
            onChange={handleInputChange}
            maxLength="50"
          />
        </div>
      </div>

      <div className="text-end">
        <button className="btn btn-success" onClick={handlePayment}>
          Pay with PayPal
        </button>
      </div>
    </div>
  );
};

const mockCartItems = [
  { id: 1, name: 'Organic Apple', price: 1.5, quantity: 3 },
  { id: 2, name: 'Whole Milk', price: 0.99, quantity: 2 },
  { id: 3, name: 'Brown Bread', price: 2.5, quantity: 1 },
];

const PaymentPage = () => {
  return <Payment cartItems={mockCartItems} />;
};

export default PaymentPage;

