import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import apiService from "../api_services/apiService";
import ProductDetails from "../components/ProductDetails.js";

const ProductDetailsPage = ({ role }) => {
  const [products, setProducts] = useState([]);
  const [, setErrors] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiService.getProducts();
        setProducts(data);
      } catch (error) {
        setErrors(error.message);
      }
    };
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (product) => {
    const confirmation = window.confirm(
      `Are you sure you want to delete the product: ${product.name} ?`
    );
    if (!confirmation) return;

    try {
      const response = await apiService.deleteProduct(product._id);
      if (response.success) {
        setProducts((prevProducts) =>
          prevProducts.filter((p) => p.id !== product.id)
        );
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditButtonClick = (product) => {
    console.log(product);
    const newQuantity = prompt(
      `Enter new quantity for ${product.name}:`,
      product.quantity
    );
    if (newQuantity === null) return; // User cancelled

    const newPrice = prompt(
      `Enter new price for ${product.name}:`,
      product.price
    );
    if (newPrice === null) return; // User cancelled

    const updatedProduct = {
      ...product,
      quantity: parseInt(newQuantity, 10),
      price: parseFloat(newPrice),
    };

    handleEditProduct(updatedProduct);
  };

  const handleEditProduct = async (updatedProduct) => {
    const confirmation = window.confirm(
      `Are you sure you want to update the product: ${updatedProduct.name}?`
    );
    if (!confirmation) return;

    try {
      const response = await apiService.updateProduct(updatedProduct._id, {
        quantity: updatedProduct.quantity,
        price: updatedProduct.price,
      });
      if (response.success) {
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p._id === updatedProduct._id ? updatedProduct : p
          )
        );
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const filteredProducts = products.filter((product) => {
    const searchTermMatch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const categoryMatch =
      categoryFilter === "all" || product.category === categoryFilter;
    return searchTermMatch && categoryMatch;
  });

  const allCategories = ["all", ...new Set(products.map((p) => p.category))];

  return (
    <div className="container py-5">
      {/* Search & Filter */}
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control rounded-pill shadow-sm"
            placeholder="🔍 Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select rounded-pill shadow-sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {allCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row g-4">
        {filteredProducts.map((product) => (
          <div key={product._id} className="col-lg-4 col-md-6 col-sm-12 d-flex align-items-stretch">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden d-flex flex-column w-100">
              {/* Image du produit (si applicable) */}
              {product.image && (
                <div className="position-relative">
                  <img src={product.image} alt={product.name} className="w-100" style={{ objectFit: "cover", height: "200px" }} />
                </div>
              )}

              {/* Contenu principal */}
              <div className="card-body d-flex flex-column flex-grow-1 text-center">
                <ProductDetails product={product} />

                {/* Actions pour l'admin */}
                {role === "admin" && (
                  <div className="d-flex justify-content-between mt-3">
                    <button
                      className="btn btn-sm btn-outline-primary d-flex align-items-center gap-2"
                      onClick={() => handleEditButtonClick(product)}
                    >
                      <i className="bi bi-pencil"></i> Modifier
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger d-flex align-items-center gap-2"
                      onClick={() => handleDeleteProduct(product)}
                    >
                      <i className="bi bi-trash"></i> Supprimer
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

        ))}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
