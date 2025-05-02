const Cart = require("../models/cart.model");
const cartController = require("../controllers/cart.controller");
const mongoose = require("mongoose");

jest.mock("../models/cart.model");

describe("Cart Controller", () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      user: { id: "123" } // Add user object with id
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createCart", () => {
    test("should create a new cart successfully", async () => {
      const mockCart = { userId: "123", products: [] };
      Cart.prototype.save.mockResolvedValue(mockCart);

      await cartController.createCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockCart);
    });

    test("should handle errors when creating cart", async () => {
      const error = new Error("Creation failed");
      Cart.prototype.save.mockRejectedValue(error);

      await cartController.createCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe("getAllCarts", () => {
    test("should return all carts for a user", async () => {
      const mockCarts = [{ userId: "123", products: [] }];
      Cart.find.mockResolvedValue(mockCarts);

      await cartController.getAllCarts(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(mockCarts);
    });

    test("should return 'vide' when no carts found", async () => {
      Cart.find.mockResolvedValue([]);

      await cartController.getAllCarts(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith('vide');
    });
    
    test("should handle errors", async () => {
      const error = new Error("Database error");
      Cart.find.mockRejectedValue(error);

      await cartController.getAllCarts(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe("getCart", () => {
    test("should return a cart by ID", async () => {
      const mockCart = { _id: "123", products: [] };
      Cart.findById.mockResolvedValue(mockCart);
      mockReq.params = { id: "123" };

      await cartController.getCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockCart);
    });
    
    test("should handle errors", async () => {
      const error = new Error("Database error");
      Cart.findById.mockRejectedValue(error);
      mockReq.params = { id: "123" };

      await cartController.getCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe("addToCart", () => {
    test("should add product to cart successfully", async () => {
      const product = { id: "prod1" };
      const mockCart = {
        _id: "123",
        products: [],
        save: jest.fn().mockResolvedValue({ _id: "123", products: [product] })
      };
      Cart.findById.mockResolvedValue(mockCart);
      mockReq.params = { id: "123" };
      mockReq.body = product;

      await cartController.addToCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ _id: "123", products: [product] });
    });

    test("should handle cart not found", async () => {
      Cart.findById.mockResolvedValue(null);
      mockReq.params = { id: "123" };

      await cartController.addToCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Cart not found" });
    });
    
    test("should handle errors", async () => {
      const error = new Error("Database error");
      Cart.findById.mockRejectedValue(error);
      mockReq.params = { id: "123" };

      await cartController.addToCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe("removeToCart", () => {
    test("should remove product from cart", async () => {
      const mockObjectId = "507f1f77bcf86cd799439011"; // Valid 24-char hex string
      const productObjectId = new mongoose.Types.ObjectId(mockObjectId);
      
      const mockCart = {
        _id: mockObjectId,
        products: [{ _id: productObjectId, equals: jest.fn(id => id.equals(productObjectId)) }],
        save: jest.fn().mockResolvedValue({ _id: mockObjectId, products: [] })
      };
      
      // Setup the equals method on the ObjectId prototype for the filter function
      mongoose.Types.ObjectId.prototype.equals = function(other) {
        return other && this.toString() === other.toString();
      };
      
      Cart.findById.mockResolvedValue(mockCart);
      mockReq.params = { id: mockObjectId };
      mockReq.body = { product_id: mockObjectId };
  
      await cartController.removeToCart(mockReq, mockRes);
  
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalled();
    });
    
    test("should handle cart not found", async () => {
      Cart.findById.mockResolvedValue(null);
      mockReq.params = { id: "123" };
      mockReq.body = { product_id: "456" };

      await cartController.removeToCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Cart not found" });
    });
    
    test("should handle errors", async () => {
      const error = new Error("Database error");
      Cart.findById.mockRejectedValue(error);
      mockReq.params = { id: "123" };
      mockReq.body = { product_id: "456" };

      await cartController.removeToCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe("deleteCart", () => {
    test("should delete cart successfully", async () => {
      Cart.findByIdAndDelete.mockResolvedValue({ _id: "123" });
      mockReq.params = { id: "123" };

      await cartController.deleteCart(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ message: "Cart deleted successfully" });
    });

    test("should handle cart not found on delete", async () => {
      Cart.findByIdAndDelete.mockResolvedValue(null);
      mockReq.params = { id: "123" };

      await cartController.deleteCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Cart not found" });
    });
    
    test("should handle errors", async () => {
      const error = new Error("Database error");
      Cart.findByIdAndDelete.mockRejectedValue(error);
      mockReq.params = { id: "123" };

      await cartController.deleteCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
    });
  });
});