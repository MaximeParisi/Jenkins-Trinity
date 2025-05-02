import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";

const URL = process.env.REACT_APP_SERVER_URL;
axios.defaults.withCredentials = true;

const ProductDetails = ({ product }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async (productAdd, quantity, product, event) => {
    try {
      if (event) event.preventDefault(); // Empêche la propagation de l'événement si présent

      const response = await axios.get(`${URL}/api/cart`);

      if (Array.isArray(response.data)) {
        await axios.put(`${URL}/api/cart/add/${response.data[0]._id}`, { product: productAdd });
      } else {
        const newCart = await axios.post(`${URL}/api/cart`);

        await axios.put(`${URL}/api/cart/add/${newCart.data._id}`, { product: productAdd });
      }

    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
    }
  };

  return (
    <div className="container py-4">
      <div className="row g-4 align-items-center">
        {/* Image du produit */}
        <div className="col-md-5">
          <img
            src={product.picture}
            alt={product.name}
            className="img-fluid rounded shadow"
            style={{ maxHeight: "300px", objectFit: "cover" }}
          />
        </div>

        {/* Détails du produit */}
        <div className="col-md-7">
          <h2 className="fw-bold">{product.name}</h2>
          <p className="text-muted mb-1">
            <strong>Marque :</strong> {product.brand}
          </p>
          <p className="text-muted">
            <strong>Catégorie :</strong> {product.category}
          </p>

          {/* Informations nutritionnelles (résumé) */}
          {product.nutritionalInformation && (
            <div className="mt-3">
              <h5 className="fw-bold">Valeurs Nutritionnelles</h5>
              <ul className="list-unstyled">
                {["energy-kcal_value", "carbohydrates_value", "sugars_value", "fat_value", "proteins_value"].map(
                  (key) =>
                    product.nutritionalInformation[key] && (
                      <li key={key}>
                        <strong>
                          {key.replace(/-/g, " ").toUpperCase()}:
                        </strong>{" "}
                        {product.nutritionalInformation[key]}
                      </li>
                    )
                )}
              </ul>

              {/* Afficher plus d'infos avec un dépliant */}
              {Object.entries(product.nutritionalInformation).some(
                ([key, value]) =>
                  ![
                    "energy-kcal_value",
                    "carbohydrates_value",
                    "sugars_value",
                    "fat_value",
                    "proteins_value",
                  ].includes(key) && value !== 0
              ) && (
                  <details className="mt-2">
                    <summary className="text-primary">Voir plus de détails</summary>
                    <ul className="list-unstyled mt-2">
                      {Object.entries(product.nutritionalInformation)
                        .filter(
                          ([key, value]) =>
                            ![
                              "energy-kcal_value",
                              "carbohydrates_value",
                              "sugars_value",
                              "fat_value",
                              "proteins_value",
                            ].includes(key) && value !== 0
                        )
                        .map(([key, value]) => (
                          <li key={key}>
                            <strong>{key.replace(/-/g, " ").toUpperCase()}:</strong> {value}
                          </li>
                        ))}
                    </ul>
                  </details>
                )}
            </div>
          )}

          {/* Prix et stock */}
          <div className="mt-4">
            <p className="fs-5">
              <strong>Prix :</strong> <span className="text-success">${product.price}</span>
            </p>
            <p className={product.availableQuantity > 0 ? "text-success" : "text-danger"}>
              <strong>Stock :</strong> {product.availableQuantity > 0 ? `${product.availableQuantity} disponibles` : "Rupture de stock"}
            </p>
          </div>

          {/* Sélection de quantité */}
          {product.availableQuantity > 0 && (
            <div className="mt-3 d-flex align-items-center">
              <label htmlFor="quantity" className="me-2">
                Quantité :
              </label>
              <div className="input-group w-auto">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  className="form-control text-center"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.availableQuantity, Number(e.target.value))))}
                  min="1"
                  max={product.availableQuantity}
                  style={{ maxWidth: "60px" }}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setQuantity(Math.min(product.availableQuantity, quantity + 1))}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Bouton Ajouter au panier */}
          <div className="mt-4">
            <button
              className="btn btn-lg btn-success w-100 d-flex align-items-center justify-content-center gap-2"
              onClick={(event) => handleAddToCart(product, quantity, product, event)}
              disabled={quantity < 1 || quantity > product.availableQuantity}
            >
              <i className="bi bi-cart-plus"></i> Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ProductDetails;