import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { FaCheckCircle, FaShoppingCart, FaTrashAlt } from "react-icons/fa";
import PaymentModal from "./PaymentModal";

const URL = process.env.REACT_APP_SERVER_URL
axios.defaults.withCredentials = true;

const Cart = ({ cartItems = [], updateCart }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const calculateTotal = () => {
    let result = 0;
    cartItems.forEach((cart) => {
      if (cart.products) {
        cart.products.forEach((item) => {
          result += item.product.price * item.product.quantity;
        });
      }
    });
    return result.toFixed(2);
  };

  const handleRemoveItem = async (id) => {
    try {
      if (!cartItems[0] || !cartItems[0]._id) {
        console.error("Erreur: Aucun panier trouvé.");
        alert("Erreur: Impossible de supprimer cet article.");
        return;
      }

      const cartId = cartItems[0]._id;
      const response = await axios.put(
        `${URL}/api/cart/remove/${cartId}`,
        { product_id: id }
      );

      if (response.status === 200) {
        alert("Article supprimé du panier !");
        updateCart(id, 0);
        window.location.reload();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article:", error.response?.data || error.message);
      alert("Une erreur est survenue lors de la suppression de l'article.");
    }
  };

  const handleRemoveCart = async (id) => {
    try {
      if (!cartItems.length || !cartItems[0]?._id) {
        console.error("Erreur: Aucun panier trouvé.");
        alert("Erreur: Impossible de supprimer le panier.");
        return;
      }

 

      console.log(`Suppression du panier avec l'ID : ${id}`);

      const response = await axios.delete(`${URL}/api/cart/${id}`, { withCredentials: true });

      if (response.status === 200) {
        alert("Panier supprimé avec succès !");
        window.location.reload();
      } else {
        console.error("Erreur lors de la suppression du panier:", response.data);
        alert("Une erreur est survenue lors de la suppression du panier.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du panier:", error.response?.data || error.message);
      alert("Impossible de supprimer le panier. Veuillez réessayer.");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">
        <FaShoppingCart className="me-2" />
        Shopping Cart
      </h2>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p>Your cart is empty!</p>
        </div>
      ) : (
        <div>
          {cartItems.map((cart) => (

            <div key={`cart-${cart._id}`} className="card shadow-sm mb-4">
              <div className="card-body">
                {cart.products &&
                  cart.products.map((item, index) => (
                    <div key={`product-${cart._id}-${item.product._id}-${index}`} className="row align-items-center mb-3">
                      <div className="col-md-2">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="img-fluid rounded"
                          style={{ maxHeight: "100px", objectFit: "cover" }}
                        />
                      </div>
                      <div className="col-md-4">
                        <h5>{item.product.name}</h5>
                        <p className="mb-0">
                          <strong>Price:</strong> ${item.product.price}
                        </p>
                      </div>
                      <div className="col-md-2">
                        <p>
                          <strong>Quantity:</strong> {item.product.availableQuantity}
                        </p>
                      </div>
                      <div className="col-md-2">
                        <p>
                          <strong>Total:</strong> ${item.product.price * item.product.price}
                        </p>
                      </div>
                      <div className="col-md-2 text-end">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleRemoveItem(item.product._id)}
                        >
                          <FaTrashAlt /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                <div className="text-end mt-3">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemoveCart(cart._id)}
                  >
                    <FaTrashAlt /> Remove Cart
                  </button>
                </div>
              </div>
            </div>
          ))}

          <hr />
          <div className="text-end">
            <h4>
              <strong>Total:</strong> ${calculateTotal()}
            </h4>
            <button
              className="btn btn-success mt-3"
              onClick={() => setShowPaymentModal(true)}
              disabled={cartItems.length === 0}
            >
              <FaCheckCircle className="me-2" />
              Proceed to Payment
            </button>
          </div>
        </div>
      )}
      <PaymentModal
        show={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        cartItems={cartItems}
        total={calculateTotal()}
      />
    </div>
  );
};

export default Cart;