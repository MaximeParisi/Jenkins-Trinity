import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import React from "react";
import PaymentModal from "./PaymentModal";

jest.mock("@paypal/react-paypal-js", () => ({
  PayPalButtons: jest.fn().mockImplementation(({ createOrder, onApprove }) => {
    return (
      <div data-testid="paypal-button">
        <button onClick={() => createOrder()} data-testid="create-order-button">
          Create Order
        </button>
        <button onClick={() => onApprove()} data-testid="approve-button">
          Approve Payment
        </button>
      </div>
    );
  }),
}));

jest.mock("axios");
window.alert = jest.fn();
Object.defineProperty(window, 'location', {
  value: { reload: jest.fn() },
  writable: true
});

describe("PaymentModal component", () => {
  const mockCartItems = [
    {
      _id: "cart123",
      products: [
        {
          product: {
            _id: "prod1",
            name: "Test Product",
            price: 10,
            quantity: 2,
          },
        },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders nothing when show is false", () => {
    render(
      <PaymentModal
        show={false}
        onClose={jest.fn()}
        cartItems={mockCartItems}
        total={20}
      />
    );
    expect(screen.queryByText("Complete Payment")).not.toBeInTheDocument();
  });

  test("renders modal when show is true", () => {
    render(
      <PaymentModal
        show={true}
        onClose={jest.fn()}
        cartItems={mockCartItems}
        total={20}
      />
    );
    expect(screen.getByText("Complete Payment")).toBeInTheDocument();
    expect(screen.getByText("Order Summary")).toBeInTheDocument();
    expect(screen.getByText("Test Product x 2")).toBeInTheDocument();
    // Use queryAllByText instead of getByText since there are multiple "$20" elements
    expect(screen.queryAllByText("$20")).toHaveLength(2);
    expect(screen.getByTestId("paypal-button")).toBeInTheDocument();
  });

  test("calls onClose when close button is clicked", () => {
    const mockOnClose = jest.fn();
    render(
      <PaymentModal
        show={true}
        onClose={mockOnClose}
        cartItems={mockCartItems}
        total={20}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "" }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("handles createOrder function correctly", async () => {
    axios.post.mockResolvedValueOnce({ data: { orderID: "123" } })
      .mockResolvedValueOnce({ data: { _id: "invoice123" } });

    render(
      <PaymentModal
        show={true}
        onClose={jest.fn()}
        cartItems={mockCartItems}
        total={20}
      />
    );

    fireEvent.click(screen.getByTestId("create-order-button"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/paypal/create-order"),
        expect.objectContaining({
          total: 20,
          cartItems: [{ name: "Test Product", price: 10, quantity: 2 }],
          id: "cart123"
        })
      );
    });
  });

  test("handles onApprove function correctly", async () => {
    axios.post.mockResolvedValueOnce({ data: { status: "COMPLETED" } });
    axios.put.mockResolvedValueOnce({});
    axios.delete.mockResolvedValueOnce({});

    render(
      <PaymentModal
        show={true}
        onClose={jest.fn()}
        cartItems={mockCartItems}
        total={20}
      />
    );

    fireEvent.click(screen.getByTestId("approve-button"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/paypal/capture-payment"),
        expect.objectContaining({ orderID: undefined })
      );
    });

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        expect.stringContaining("/api/cart/cart123"),
        {}
      );
    });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Payment successful!");
    });

    await waitFor(() => {
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  test("handles error in onApprove", async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    axios.post.mockRejectedValueOnce(new Error("Payment failed"));

    render(
      <PaymentModal
        show={true}
        onClose={jest.fn()}
        cartItems={mockCartItems}
        total={20}
      />
    );

    fireEvent.click(screen.getByTestId("approve-button"));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error processing payment:", expect.any(Error));
    });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Payment failed. Please try again.");
    });

    consoleErrorSpy.mockRestore();
  });
});