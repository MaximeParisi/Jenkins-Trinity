import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import apiService from "../api_services/apiService";

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await apiService.getProducts();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <Container fluid className="px-5">
            {/* Hero Section */}
            <Row className="bg-primary text-white py-5 text-center rounded shadow-sm">
                <Col>
                    <h1 className="fw-bold">Découvrez Nos Offres Exclusives</h1>
                    <p className="lead">Les meilleures promotions du moment vous attendent !</p>
                    <Button variant="light" size="lg" className="fw-bold">Voir les Offres</Button>
                </Col>
            </Row>

            {/* Produits Tendance */}
            <Row className="my-5">
                <Col><h2 className="text-center fw-bold">Produits Tendance 🔥</h2></Col>
            </Row>
            {loading ? (
                <Row className="justify-content-center">
                    <Spinner animation="border" variant="primary" role="status" />
                </Row>
            ) : (
                <Row className="g-4">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <Col md={4} lg={3} key={product._id}>
                                <Card className="h-100 shadow-sm">
                                    <Card.Img variant="top" src={product.picture} className="p-3 rounded" />
                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title className="fw-bold">{product.name}</Card.Title>
                                        <Card.Text className="text-muted">{product.category}</Card.Text>
                                        <Card.Text className="fw-bold text-primary fs-5">{product.price}€</Card.Text>
                                        <Button variant="success" className="mt-auto fw-bold">Ajouter au Panier</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col><p className="text-center text-danger">Aucun produit disponible.</p></Col>
                    )}
                </Row>
            )}
        </Container>
    );
};

export default HomePage;