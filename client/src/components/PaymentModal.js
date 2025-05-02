import { PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";

const URL = process.env.REACT_APP_SERVER_URL
axios.defaults.withCredentials = true;

const PaymentModal = ({ show, onClose, cartItems = [], total }) => {
  let orderID

  const createOrder = async () => {
    try {
      const formattedProducts = cartItems.flatMap((cart) =>
        cart.products?.map((item) => ({
          name: item.product.name,
          price: item.product.price,
          quantity: item.product.quantity,
        })) || []
      );
      const paypalOrder = await axios.post(`${URL}/api/paypal/create-order`, {
        total,
        cartItems: formattedProducts,
        id: cartItems[0]._id
      });

      orderID = paypalOrder.data.orderID;
      const response = await axios.post(`${URL}/api/invoices/`, {
        orderID: paypalOrder.data.orderID,
        products: formattedProducts,
        total,
        paymentStatus: "not completed",
      }
      );
      console.log("test4")

      return response.data._id;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const onApprove = async (orderID) => {
    console.log("test1")

    try {
      const response = await axios.post(`${URL}/api/paypal/capture-payment`, {
        orderID: orderID,
      });
      console.log("test2")

      if (response.data.status === "COMPLETED") {
        await axios.put(`${URL}/api/invoices/${orderID}`, {
          paymentStatus: "completed"
        });
      }
      console.log("test3")

      if (cartItems[0] && cartItems[0]._id) {
        await axios.delete(`${URL}/api/cart/${cartItems[0]._id}`, {
        });
      }
      alert("Payment successful!");
      window.location.reload();
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Payment failed. Please try again.");
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show" style={{ display: "block" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Complete Payment</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="order-summary mb-4">
              <h6 className="text-muted">Order Summary</h6>
              {cartItems.length > 0 &&
                cartItems.map((cart) =>
                  cart.products?.map((item) => (
                    <div key={item.product._id} className="d-flex justify-content-between align-items-center mb-2">
                      <span>
                        {item.product.name} x {item.product.quantity}
                      </span>
                      <strong>${item.product.price * item.product.quantity}</strong>
                    </div>
                  ))
                )}
              <hr />
              <div className="d-flex justify-content-between">
                <h5>Total:</h5>
                <h5>${total}</h5>
              </div>
            </div>
            <PayPalButtons
              createOrder={() => createOrder()}
              onApprove={() => onApprove(orderID)}
              style={{ layout: "vertical", color: "blue" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;