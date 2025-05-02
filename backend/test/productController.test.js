const productController = require("../controllers/productController");
const Product = require("../models/Product");

// Moquer le modèle Mongoose
jest.mock("../models/Product");

// Moquer la fonction setNutritionalValues
jest.mock("../utils/openFoodFact", () => ({
  setNutritionalValues: jest.fn(),
}));

const { setNutritionalValues } = require("../utils/openFoodFact");

describe("Product Controller", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Nettoie les mocks après chaque test
  });

  describe("getProducts", () => {
    it("should return all products", async () => {
      const mockProducts = [
        {
          id: 1,
          name: "Product 1",
          price: 10,
          brand: "Brand A",
          category: "Category A",
          availableQuantity: 100,
        },
        {
          id: 2,
          name: "Product 2",
          price: 20,
          brand: "Brand B",
          category: "Category B",
          availableQuantity: 200,
        },
      ];
      Product.find.mockResolvedValue(mockProducts);

      const req = {};
      const res = {
        json: jest.fn(),
      };

      await productController.getProducts(req, res);

      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });

    it("should handle errors", async () => {
      Product.find.mockRejectedValue(new Error("Database error"));

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await productController.getProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });
  describe("addProduct", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should add a new product", async () => {
      const mockProduct = {
        name: "Product 1",
        price: 10,
        brand: "Brand A",
        category: "Category A",
        availableQuantity: 100,
      };
  
      setNutritionalValues.mockResolvedValue(mockProduct);
  
      const savedProduct = {
        ...mockProduct,
        _id: "507f1f77bcf86cd799439011"
      };
  
      const mockSave = jest.fn().mockResolvedValue(savedProduct);
      Product.mockImplementation(() => ({
        save: mockSave
      }));
  
      const req = {
        params: { barcode: "3017620422003" },
        body: { quantity: 1, price: 10 },
      };
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await productController.addProduct(req, res);
  
      expect(setNutritionalValues).toHaveBeenCalledWith("3017620422003", 1, 10);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(savedProduct);
    });
  
    it("should handle errors when product is not found", async () => {
      const notFoundError = { error: "produit introuvable" };
      setNutritionalValues.mockResolvedValue(notFoundError);
  
      const req = {
        params: { barcode: "1234567890123" },
        body: { quantity: 1, price: 10 },
      };
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await productController.addProduct(req, res);
  
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(notFoundError);
    });
  
    it("should handle database errors during product creation", async () => {
      const mockProduct = {
        name: "Product 1",
        price: 10,
        brand: "Brand A",
      };
  
      setNutritionalValues.mockResolvedValue(mockProduct);
  
      const mockSave = jest.fn().mockRejectedValue(new Error("Database error"));
      Product.mockImplementation(() => ({
        save: mockSave
      }));
  
      const req = {
        params: { barcode: "1234567890123" },
        body: { quantity: 1, price: 10 },
      };
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await productController.addProduct(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  describe("updateProduct", () => {
    it("should update a product", async () => {
      const mockUpdatedProduct = { id: 1, name: "Updated Product", price: 15 };

      Product.findByIdAndUpdate.mockResolvedValue(mockUpdatedProduct);

      const req = { params: { id: 1 }, body: mockUpdatedProduct };

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await productController.updateProduct(req, res);

      expect(res.json).toHaveBeenCalledWith(mockUpdatedProduct);
    });

    it("should handle errors during product update", async () => {
      Product.findByIdAndUpdate.mockRejectedValue(new Error("Database error"));

      const req = { params: { id: 1 }, body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await productController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
    });

    it("should return a 404 if the product is not found", async () => {
      Product.findByIdAndUpdate.mockResolvedValue(null); // Simule que le produit n'est pas trouvé

      const req = { params: { id: "nonexistent-id" }, body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await productController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Product not found" });
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product", async () => {
      Product.findByIdAndDelete.mockResolvedValue({});

      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await productController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Product deleted successfully",
      });
    });

    it("should handle errors during product deletion", async () => {
      Product.findByIdAndDelete.mockRejectedValue(new Error("Database error"));

      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await productController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
    });

    it("should return a 404 if the product is not found during deletion", async () => {
      Product.findByIdAndDelete.mockResolvedValue(null); // Simule que le produit n'est pas trouvé

      const req = { params: { id: "nonexistent-id" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await productController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Product not found" });
    });
  });
});
