import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import React from "react";
import ProductDetails from "./ProductDetails";

// Mock axios and apiService
jest.mock("axios");
jest.mock("../api_services/apiService");

describe("ProductDetails Component", () => {
  const mockProduct = {
    _id: "1",
    name: "Test Product",
    brand: "Test Brand",
    category: "Test Category",
    picture: "test.jpg",
    price: 9.99,
    availableQuantity: 10,
    nutritionalInformation: {
      "energy-kcal_value": 100,
      "carbohydrates_value": 20,
      "sugars_value": 5,
      "fat_value": 10,
      "proteins_value": 15,
      "additional_value": 2
    }
  };

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: [{ _id: "cart1" }] });
    axios.put.mockResolvedValue({ data: { success: true } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders product details correctly", () => {
    render(<ProductDetails product={mockProduct} />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText(/Test Brand/)).toBeInTheDocument();
    expect(screen.getByText(/Test Category/)).toBeInTheDocument();
    expect(screen.getByText(/\$9.99/)).toBeInTheDocument();
    expect(screen.getByText(/10 disponibles/)).toBeInTheDocument();
  });

  test("renders nutritional information correctly", () => {
    render(<ProductDetails product={mockProduct} />);

    expect(screen.getByText(/ENERGY KCAL_VALUE:/)).toBeInTheDocument();
    expect(screen.getByText(/CARBOHYDRATES_VALUE:/)).toBeInTheDocument();
    expect(screen.getByText(/Voir plus de détails/)).toBeInTheDocument();
  });

  test("quantity increment and decrement work correctly", () => {
    render(<ProductDetails product={mockProduct} />);

    const incrementButton = screen.getByText("+");
    const decrementButton = screen.getByText("-");
    const quantityInput = screen.getByLabelText(/Quantité/i);

    expect(quantityInput.value).toBe("1");

    fireEvent.click(incrementButton);
    expect(quantityInput.value).toBe("2");

    fireEvent.click(decrementButton);
    expect(quantityInput.value).toBe("1");
  });

  test("handleAddToCart adds product to cart", async () => {
    render(<ProductDetails product={mockProduct} />);

    const addToCartButton = screen.getByText(/Ajouter au panier/);
    fireEvent.click(addToCartButton);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining(`/api/cart`)
      );
    });

    expect.any(Object)
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining(`/api/cart/add/cart1`),
        { product: mockProduct }
      );
    });
  });
});