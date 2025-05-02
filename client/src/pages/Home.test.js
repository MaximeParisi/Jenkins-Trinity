import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import apiService from '../api_services/apiService';
import HomePage from './Home';

// Mock the API service
jest.mock('../api_services/apiService');

describe('HomePage Component', () => {
    const mockProducts = [
        { _id: '1', name: 'Product 1', category: 'Category 1', price: 19.99, picture: 'image1.jpg' },
        { _id: '2', name: 'Product 2', category: 'Category 2', price: 29.99, picture: 'image2.jpg' }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders loading spinner when fetching products', () => {
        apiService.getProducts.mockResolvedValueOnce([]);
        render(<HomePage />);
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    test('renders products after loading', async () => {
        apiService.getProducts.mockResolvedValueOnce(mockProducts);
        render(<HomePage />);

        await waitFor(() => {
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
        });

        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Product 2')).toBeInTheDocument();
        expect(screen.getByText('Category 1')).toBeInTheDocument();
        expect(screen.getByText('Category 2')).toBeInTheDocument();
        expect(screen.getByText('19.99€')).toBeInTheDocument();
        expect(screen.getByText('29.99€')).toBeInTheDocument();
    });

    test('renders hero section correctly', () => {
        apiService.getProducts.mockResolvedValueOnce([]);
        render(<HomePage />);

        expect(screen.getByText('Découvrez Nos Offres Exclusives')).toBeInTheDocument();
        expect(screen.getByText('Les meilleures promotions du moment vous attendent !')).toBeInTheDocument();
        expect(screen.getByText('Voir les Offres')).toBeInTheDocument();
    });

    test('renders "Produits Tendance" heading', () => {
        apiService.getProducts.mockResolvedValueOnce([]);
        render(<HomePage />);

        expect(screen.getByText('Produits Tendance 🔥')).toBeInTheDocument();
    });

    test('shows message when no products are available', async () => {
        apiService.getProducts.mockResolvedValueOnce([]);
        render(<HomePage />);

        await waitFor(() => {
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
        });

        expect(screen.getByText('Aucun produit disponible.')).toBeInTheDocument();
    });

    test('handles API error gracefully', async () => {
        console.error = jest.fn(); // Mock console.error
        apiService.getProducts.mockRejectedValueOnce(new Error('API error'));

        render(<HomePage />);

        await waitFor(() => {
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
        });

        expect(console.error).toHaveBeenCalled();
        expect(screen.getByText('Aucun produit disponible.')).toBeInTheDocument();
    });
});