import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import apiService from "../api_services/apiService";
import ProductDetailsPage from "../pages/Product";

// Mock axios and apiService
jest.mock("axios");
jest.mock("../api_services/apiService");

describe("ProductDetailsPage Component", () => {
  const mockProducts = [
    {
      _id: "1",
      name: "Product 1",
      category: "Category A",
      price: 10.99,
      quantity: 5,
      image: "image1.jpg"
    },
    {
      _id: "2",
      name: "Product 2",
      category: "Category B",
      price: 20.99,
      quantity: 10,
      image: "image2.jpg"
    }
  ];

  beforeEach(() => {
    apiService.getProducts.mockResolvedValue(mockProducts);
    apiService.deleteProduct.mockResolvedValue({ success: true });
    apiService.updateProduct.mockResolvedValue({ success: true });
    window.confirm = jest.fn();
    window.alert = jest.fn();
    window.prompt = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("filters products by search term", async () => {
    render(<ProductDetailsPage role="user" />);
    
    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeInTheDocument();
    });
    expect(screen.getByText("Product 2")).toBeInTheDocument();
    
    const searchInput = screen.getByPlaceholderText(/Search products/i);
    fireEvent.change(searchInput, { target: { value: "Product 1" } });
    
    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeInTheDocument();
    });
    expect(screen.queryByText("Product 2")).not.toBeInTheDocument();
  });

  test("filters products by category", async () => {
    render(<ProductDetailsPage role="user" />);
    
    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeInTheDocument();
    });
    expect(screen.getByText("Product 2")).toBeInTheDocument();
    
    const categorySelect = screen.getByRole("combobox");
    fireEvent.change(categorySelect, { target: { value: "Category A" } });
    
    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeInTheDocument();
    });
    expect(screen.queryByText("Product 2")).not.toBeInTheDocument();
  });

  test("admin can see edit and delete buttons", async () => {
    render(<ProductDetailsPage role="admin" />);
    
    await waitFor(() => {
      expect(screen.getAllByText(/Modifier/i)).toHaveLength(2);
    });
    expect(screen.getAllByText(/Supprimer/i)).toHaveLength(2);
  });

  test("user cannot see edit and delete buttons", async () => {
    render(<ProductDetailsPage role="user" />);
    
    await waitFor(() => {
      expect(screen.queryByText(/Modifier/i)).not.toBeInTheDocument();
    });
    expect(screen.queryByText(/Supprimer/i)).not.toBeInTheDocument();
  });

  test("handles product deletion", async () => {
    window.confirm.mockReturnValue(true);
    
    render(<ProductDetailsPage role="admin" />);
    
    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeInTheDocument();
    });
    
    const deleteButtons = await screen.findAllByText(/Supprimer/i);
    fireEvent.click(deleteButtons[0]);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(apiService.deleteProduct).toHaveBeenCalledWith("1");
  });

  test("handles product deletion cancellation", async () => {
    window.confirm.mockReturnValue(false);
    
    render(<ProductDetailsPage role="admin" />);
    
    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeInTheDocument();
    });
    
    const deleteButtons = await screen.findAllByText(/Supprimer/i);
    fireEvent.click(deleteButtons[0]);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(apiService.deleteProduct).not.toHaveBeenCalled();
  });

  test("handles product edit", async () => {
    window.prompt.mockReturnValueOnce("15").mockReturnValueOnce("25.99");
    window.confirm.mockReturnValue(true);
    
    render(<ProductDetailsPage role="admin" />);
    
    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeInTheDocument();
    });
    
    const editButtons = await screen.findAllByText(/Modifier/i);
    fireEvent.click(editButtons[0]);
    
    expect(window.prompt).toHaveBeenCalledTimes(2);
    expect(window.confirm).toHaveBeenCalled();
    expect(apiService.updateProduct).toHaveBeenCalledWith("1", {
      quantity: 15,
      price: 25.99
    });
  });

  test("handles product edit cancellation on quantity", async () => {
    window.prompt.mockReturnValueOnce(null);
    
    render(<ProductDetailsPage role="admin" />);
    
    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeInTheDocument();
    });
    
    const editButtons = await screen.findAllByText(/Modifier/i);
    fireEvent.click(editButtons[0]);
    
    expect(window.prompt).toHaveBeenCalledTimes(1);
    expect(apiService.updateProduct).not.toHaveBeenCalled();
  });

  test("handles product edit cancellation on price", async () => {
    window.prompt.mockReturnValueOnce("15").mockReturnValueOnce(null);
    
    render(<ProductDetailsPage role="admin" />);
    
    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeInTheDocument();
    });
    
    const editButtons = await screen.findAllByText(/Modifier/i);
    fireEvent.click(editButtons[0]);
    
    expect(window.prompt).toHaveBeenCalledTimes(2);
    expect(apiService.updateProduct).not.toHaveBeenCalled();
  });

  test("handles API error when fetching products", async () => {
    const errorMsg = "Error fetching products";
    apiService.getProducts.mockRejectedValueOnce(new Error(errorMsg));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<ProductDetailsPage role="user" />);
    
    await waitFor(() => {
      expect(screen.queryByText("Product 1")).not.toBeInTheDocument();
    });
    
    consoleSpy.mockRestore();
  });
});
