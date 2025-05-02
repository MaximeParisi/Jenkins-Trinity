import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Cart from "../components/Cart";

const URL = process.env.REACT_APP_SERVER_URL
axios.defaults.withCredentials = true;

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`${URL}/api/cart`);

        if (!response.data || response.data === "vide") {
          console.log("Aucun article dans le panier.");
          setCartItems([]);
        } else {
          setCartItems(response.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du panier:", error.response?.data || error.message);
        alert("Une erreur est survenue lors de la récupération du panier.");
      }
    })()
  }, []);

  const updateCart = (id, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  return <Cart cartItems={cartItems} updateCart={updateCart} />;
};

export default CartPage;