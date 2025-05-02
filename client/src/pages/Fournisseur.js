import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";

const URL = process.env.REACT_APP_SERVER_URL;
axios.defaults.withCredentials = true;

const Fournisseur = ({ isDarkMode }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [cartQuantities, setCartQuantities] = useState({});
  const [cartPrices, setCartPrices] = useState({});

  const [productFilter, setProductFilter] = useState(""); // New state for filtering products

  const pageSize = 20;

  const createProduct = async (productCode) => {
    if (!cartQuantities[productCode] || !cartPrices[productCode]) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post(`${URL}/api/products/${productCode}`, {
        quantity: cartQuantities[productCode],
        price: cartPrices[productCode],
      });

      alert("Product added successfully!");
      setCartQuantities((prev) => ({ ...prev, [productCode]: "" }));
      setCartPrices((prev) => ({ ...prev, [productCode]: "" }));
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Error adding product");
    }
  };

  const handleQuantityChange = (productCode, value) => {
    setCartQuantities((prev) => ({ ...prev, [productCode]: value }));
  };

  const handlePriceChange = (productCode, value) => {
    setCartPrices((prev) => ({ ...prev, [productCode]: value }));
  };

  // Apply filter on products
  const filteredProducts = products.filter((product) => {
    if (!productFilter) return true; // If no filter, return all products

    const productName = product.product_name.toLowerCase();
    return productName.includes(productFilter.toLowerCase()) &&
    JSON.stringify(product.categories_tags).toLowerCase().includes(category.toLowerCase());
  });

  // Fetch products when search params change
  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${URL}/api/off`,
          {
            params: {
              page: currentPage,
              pageSize,
              search: productFilter,
            }
          }
        );

        setProducts(response.data.products || []);
        setTotalPages(response.data.totalPages || 0);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [currentPage, productFilter]);

  return (
    <div
      className={`container-fluid ${isDarkMode ? "bg-dark text-light" : "bg-light text-dark"
        }`}
    >
      <div className="row px-4 mb-5">
        <div className="col-12 mb-4">
          <h3 className="text-center">Product Catalog</h3>

          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <select
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="beverages">Beverages</option>
                <option value="snacks">Snacks</option>
                <option value="dairy">Dairy</option>
                <option value="cereals">Cereals</option>
              </select>
            </div>

            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Filter by product name..."
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {filteredProducts.map((product) => (
                <div key={product.code} className="col-md-6 col-lg-3">
                  <div
                    className={`card h-100 ${isDarkMode ? "bg-dark text-light" : ""
                      }`}
                  >
                    <img
                      src={product.image_url || "/placeholder.png"}
                      className="card-img-top"
                      alt={product.product_name}
                      style={{ height: "200px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{product.product_name}</h5>
                      <p className="card-text">
                        <strong>Brand:</strong> {product.brands || "Unknown"}
                        <br />
                        <strong>Barcode:</strong> {product.code}
                      </p>
                      <div className="mb-3">
                        <label htmlFor="quantity" className="form-label">
                          Quantity
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id={`quantity-${product.code}`}
                          value={cartQuantities[product.code] || ""}
                          onChange={(e) =>
                            handleQuantityChange(product.code, e.target.value)
                          }
                          placeholder="Enter quantity"
                        />

                        <input
                          type="number"
                          className="form-control"
                          id={`price-${product.code}`}
                          value={cartPrices[product.code] || ""}
                          onChange={(e) =>
                            handlePriceChange(product.code, e.target.value)
                          }
                          placeholder="Enter price"
                          step="0.01"
                        />
                      </div>
                      <button
                        className="btn btn-primary"
                        onClick={() => createProduct(product.code)}
                      >
                        Add to Stock
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </button>
                </li>
                {[...Array(Math.min(5, totalPages))].map((_, idx) => (
                  <li
                    key={idx}
                    className={`page-item ${currentPage === idx + 1 ? "active" : ""
                      }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(idx + 1)}
                    >
                      {idx + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${currentPage === totalPages ? "disabled" : ""
                    }`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default Fournisseur;
