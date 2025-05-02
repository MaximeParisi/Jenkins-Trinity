import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

jest.mock('axios', () => ({
  defaults: {
    headers: {
      common: {}
    }
  }
}));

describe('LogoutButton Component', () => {
  const mockSetIsLoggedIn = jest.fn();
  const mockSetRole = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);

    // Mock storage methods
    Object.defineProperty(window, 'localStorage', {
      value: {
        removeItem: jest.fn()
      },
      writable: true
    });

    Object.defineProperty(window, 'sessionStorage', {
      value: {
        removeItem: jest.fn()
      },
      writable: true
    });

    // Mock document.cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'accessToken=test-token'
    });
  });

  test('renders logout button correctly', () => {
    render(<LogoutButton setIsLoggedIn={mockSetIsLoggedIn} setRole={mockSetRole} />);

    const buttonElement = screen.getByRole('button', { name: /logout/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('btn btn-danger');
  });

  test('handles logout correctly when clicked', () => {
    render(<LogoutButton setIsLoggedIn={mockSetIsLoggedIn} setRole={mockSetRole} />);

    const buttonElement = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(buttonElement);

    // Check if all functions were called properly
    expect(document.cookie).toBe('accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;');
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('userId');
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('accessToken');
    expect(localStorage.removeItem).toHaveBeenCalledWith('accessToken');
    expect(axios.defaults.headers.common['x-access-token']).toBeNull();
    expect(mockSetIsLoggedIn).toHaveBeenCalledWith(false);
    expect(mockSetRole).toHaveBeenCalledWith('');
    expect(mockNavigate).toHaveBeenCalledWith('/LoginRegister');
  });

  test('completes logout process in correct order', () => {
    const order = [];

    // Override implementation to track order
    sessionStorage.removeItem.mockImplementation(() => order.push('sessionStorage'));
    localStorage.removeItem.mockImplementation(() => order.push('localStorage'));
    mockSetIsLoggedIn.mockImplementation(() => order.push('setIsLoggedIn'));
    mockSetRole.mockImplementation(() => order.push('setRole'));
    mockNavigate.mockImplementation(() => order.push('navigate'));

    render(<LogoutButton setIsLoggedIn={mockSetIsLoggedIn} setRole={mockSetRole} />);

    const buttonElement = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(buttonElement);

    // Check that expected functions were called
    expect(mockSetIsLoggedIn).toHaveBeenCalled();
    expect(mockSetRole).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalled();

    // Verify navigate was called last
    expect(order[order.length - 1]).toBe('navigate');
  });
});
