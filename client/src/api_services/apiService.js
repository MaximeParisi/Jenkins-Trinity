import axiosInstance from "./axiosInstance";

const apiService = {
  getProducts: async () => {
    try {
      const response = await axiosInstance.get("/products/");
      return response.data;
    } catch (error) {
      throw new Error("Oups !! Failed to fetch products : " + error);
    }
  },
  createProduct: async (productData) => {
    try {
      const response = await axiosInstance.post("/products/", productData);
      return response.data;
    } catch (error) {
      throw new Error("Oups !! Failed to create product" + error);
    }
  },
  updateProduct: async (id, productData) => {
    try {
      const response = await axiosInstance.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to update product with ID: ${id}, the error : ${error} `
      );
    }
  },
  deleteProduct: async (id) => {
    try {
      const response = await axiosInstance.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete product with ID: ${id}`);
    }
  },
};

export default apiService;
