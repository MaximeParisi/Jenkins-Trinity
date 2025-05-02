import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { saveAs } from 'file-saver';
import React from 'react';
import PurchaseHistory from './HistoryPurchase';

// Mock file-saver
jest.mock('file-saver', () => ({
  saveAs: jest.fn()
}));

describe('PurchaseHistory component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders purchase history title', () => {
    render(<PurchaseHistory />);
    expect(screen.getByText('Purchase History')).toBeInTheDocument();
  });

  test('renders search input field', () => {
    render(<PurchaseHistory />);
    expect(screen.getByPlaceholderText('Search by date, total, or status')).toBeInTheDocument();
  });

  test('renders all transaction rows initially', () => {
    render(<PurchaseHistory />);
    expect(screen.getByText('2025-01-01')).toBeInTheDocument();
    expect(screen.getByText('2025-01-05')).toBeInTheDocument();
    expect(screen.getByText('$45.75')).toBeInTheDocument();
    expect(screen.getByText('$25.99')).toBeInTheDocument();
  });

  test('filters transactions when search term is entered', () => {
    render(<PurchaseHistory />);
    const searchInput = screen.getByPlaceholderText('Search by date, total, or status');
    
    fireEvent.change(searchInput, { target: { value: '2025-01-01' } });
    
    expect(screen.getByText('2025-01-01')).toBeInTheDocument();
    expect(screen.queryByText('2025-01-05')).not.toBeInTheDocument();
  });

  test('displays "No transactions found" when no results match search', () => {
    render(<PurchaseHistory />);
    const searchInput = screen.getByPlaceholderText('Search by date, total, or status');
    
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    expect(screen.getByText('No transactions found.')).toBeInTheDocument();
  });

  test('downloads receipt when download button is clicked', () => {
    render(<PurchaseHistory />);
    const downloadButtons = screen.getAllByText('Download');
    
    fireEvent.click(downloadButtons[0]);
    
    expect(saveAs).toHaveBeenCalled();
    expect(saveAs.mock.calls[0][1]).toBe('receipt_1.txt');
  });

  test('renders correct status badge styles', () => {
    render(<PurchaseHistory />);
    
    const paidBadge = screen.getByText('Paid');
    const pendingBadge = screen.getByText('Pending');
    
    expect(paidBadge).toHaveClass('bg-success');
    expect(pendingBadge).toHaveClass('bg-warning');
    expect(pendingBadge).toHaveClass('text-dark');
  });

  test('renders all items for each transaction', () => {
    render(<PurchaseHistory />);
    
    expect(screen.getByText('Organic Apple x3 - $1.50')).toBeInTheDocument();
    expect(screen.getByText('Whole Milk x2 - $0.99')).toBeInTheDocument();
    expect(screen.getByText('Brown Bread x1 - $2.50')).toBeInTheDocument();
    expect(screen.getByText('Cheddar Cheese x1 - $3.99')).toBeInTheDocument();
  });

  test('search is case insensitive for status', () => {
    render(<PurchaseHistory />);
    const searchInput = screen.getByPlaceholderText('Search by date, total, or status');
    
    fireEvent.change(searchInput, { target: { value: 'paid' } });
    
    expect(screen.getByText('2025-01-01')).toBeInTheDocument();
    expect(screen.queryByText('2025-01-05')).not.toBeInTheDocument();
  });
});
