import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const URL = process.env.REACT_APP_SERVER_URL;
axios.defaults.withCredentials = true;

const AllInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await axios.get(`${URL}/api/invoices`);
                setInvoices(response.data);
            } catch (error) {
                console.error('Error fetching invoices:', error);
                setError('Failed to load invoices.');
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    const deleteInvoice = async (id) => {
        try {
            await axios.delete(`${URL}/api/invoices/${id}`);
            setInvoices((prevInvoices) => prevInvoices.filter(invoice => invoice._id !== id));
        } catch (error) {
            console.error('Error deleting invoice:', error);
        }
    };

    if (loading) return <Spinner animation="border" variant="primary" />;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Invoices List</h2>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Total Amount (€)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice, index) => (
                        <tr key={invoice._id}>
                            <td>{index + 1}</td>
                            <td>{new Date(invoice.date).toLocaleDateString()}</td>
                            <td>{invoice.totalAmount.toFixed(2)}</td>
                            <td>
                                <Button variant="danger" size="sm" onClick={() => deleteInvoice(invoice._id)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default AllInvoices;
