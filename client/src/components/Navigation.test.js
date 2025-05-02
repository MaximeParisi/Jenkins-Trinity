import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Navigation from './Navigation';

// Mock the react-icons
jest.mock('react-icons/fa', () => ({
    FaIndustry: () => <span data-testid="fa-industry" />,
    FaProductHunt: () => <span data-testid="fa-product" />,
    FaShoppingCart: () => <span data-testid="fa-cart" />,
    FaUser: () => <span data-testid="fa-user" />,
    FaUsers: () => <span data-testid="fa-users" />,
}));

// Mock LogoutButton component
jest.mock('./LogoutButton', () => {
    return function MockLogoutButton(props) {
        return <button data-testid="logout-button" onClick={() => {
            props.setIsLoggedIn(false);
            props.setRole(null);
        }}>Logout</button>;
    };
});

describe('Navigation Component', () => {
    const mockToggleMode = jest.fn();
    const mockSetIsLoggedIn = jest.fn();
    const mockSetRole = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders Trinity Backoffice brand', () => {
        render(
            <BrowserRouter>
                <Navigation
                    isLoggedIn={false}
                    role={null}
                    toggleMode={mockToggleMode}
                    isDarkMode={false}
                    setIsLoggedIn={mockSetIsLoggedIn}
                    setRole={mockSetRole}
                />
            </BrowserRouter>
        );

        expect(screen.getByText('Trinity Backoffice')).toBeInTheDocument();
    });

    test('renders dark/light mode toggle button', () => {
        render(
            <BrowserRouter>
                <Navigation
                    isLoggedIn={false}
                    role={null}
                    toggleMode={mockToggleMode}
                    isDarkMode={false}
                    setIsLoggedIn={mockSetIsLoggedIn}
                    setRole={mockSetRole}
                />
            </BrowserRouter>
        );

        const toggleButton = screen.getByText('Dark Mode');
        expect(toggleButton).toBeInTheDocument();

        fireEvent.click(toggleButton);
        expect(mockToggleMode).toHaveBeenCalledTimes(1);
    });

    test('shows different text on toggle button based on isDarkMode', () => {
        render(
            <BrowserRouter>
                <Navigation
                    isLoggedIn={false}
                    role={null}
                    toggleMode={mockToggleMode}
                    isDarkMode={true}
                    setIsLoggedIn={mockSetIsLoggedIn}
                    setRole={mockSetRole}
                />
            </BrowserRouter>
        );

        expect(screen.getByText('Light Mode')).toBeInTheDocument();
    });

    test('renders user navigation links when logged in as user', () => {
        render(
            <MemoryRouter>
                <Navigation
                    isLoggedIn={true}
                    role="user"
                    toggleMode={mockToggleMode}
                    isDarkMode={false}
                    setIsLoggedIn={mockSetIsLoggedIn}
                    setRole={mockSetRole}
                />
            </MemoryRouter>
        );

        expect(screen.getByText('Cart')).toBeInTheDocument();
        expect(screen.getByText('Scanner')).toBeInTheDocument();
        expect(screen.getByText('Your Account')).toBeInTheDocument();
        expect(screen.queryByText('Account Manager')).not.toBeInTheDocument();
        expect(screen.queryByText('Supplier')).not.toBeInTheDocument();
    });

    test('renders admin navigation links when logged in as admin', () => {
        render(
            <MemoryRouter>
                <Navigation
                    isLoggedIn={true}
                    role="admin"
                    toggleMode={mockToggleMode}
                    isDarkMode={false}
                    setIsLoggedIn={mockSetIsLoggedIn}
                    setRole={mockSetRole}
                />
            </MemoryRouter>
        );

        expect(screen.getByText('Products')).toBeInTheDocument();
        expect(screen.getByText('Account Manager')).toBeInTheDocument();
        expect(screen.getByText('Supplier')).toBeInTheDocument();
        expect(screen.getByText('Invoices')).toBeInTheDocument();
        expect(screen.queryByText('Cart')).not.toBeInTheDocument();
        expect(screen.queryByText('Your Account')).not.toBeInTheDocument();
    });

    test('does not render navigation links when not logged in', () => {
        render(
            <MemoryRouter>
                <Navigation
                    isLoggedIn={false}
                    role={null}
                    toggleMode={mockToggleMode}
                    isDarkMode={false}
                    setIsLoggedIn={mockSetIsLoggedIn}
                    setRole={mockSetRole}
                />
            </MemoryRouter>
        );

        expect(screen.queryByText('Products')).not.toBeInTheDocument();
        expect(screen.queryByText('Cart')).not.toBeInTheDocument();
        expect(screen.queryByText('Account Manager')).not.toBeInTheDocument();
    });

    test('renders logout button when logged in', () => {
        render(
            <MemoryRouter>
                <Navigation
                    isLoggedIn={true}
                    role="user"
                    toggleMode={mockToggleMode}
                    isDarkMode={false}
                    setIsLoggedIn={mockSetIsLoggedIn}
                    setRole={mockSetRole}
                />
            </MemoryRouter>
        );

        expect(screen.getByTestId('logout-button')).toBeInTheDocument();
    });

    test('does not render logout button when not logged in', () => {
        render(
            <MemoryRouter>
                <Navigation
                    isLoggedIn={false}
                    role={null}
                    toggleMode={mockToggleMode}
                    isDarkMode={false}
                    setIsLoggedIn={mockSetIsLoggedIn}
                    setRole={mockSetRole}
                />
            </MemoryRouter>
        );

        expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
    });

    test('logout button calls setIsLoggedIn and setRole when clicked', () => {
        render(
            <MemoryRouter>
                <Navigation
                    isLoggedIn={true}
                    role="user"
                    toggleMode={mockToggleMode}
                    isDarkMode={false}
                    setIsLoggedIn={mockSetIsLoggedIn}
                    setRole={mockSetRole}
                />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByTestId('logout-button'));
        expect(mockSetIsLoggedIn).toHaveBeenCalledWith(false);
        expect(mockSetRole).toHaveBeenCalledWith(null);
    });

    test('renders navbar toggler button', () => {
        render(
            <MemoryRouter>
                <Navigation
                    isLoggedIn={false}
                    role={null}
                    toggleMode={mockToggleMode}
                    isDarkMode={false}
                    setIsLoggedIn={mockSetIsLoggedIn}
                    setRole={mockSetRole}
                />
            </MemoryRouter>
        );

        expect(screen.getByLabelText('Toggle navigation')).toBeInTheDocument();
    });
});
