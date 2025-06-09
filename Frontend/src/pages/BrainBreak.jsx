import React from 'react';
import { Container, Button, Row, Col, Card } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './BrainBreak.css';

const BrainBreak = () => {
    const navigate = useNavigate();

    return (
        <>
            <Header />
            <section className="brain-break-section">
                <Container>
                    <div className="brain-break-content">
                        <h1>Take a Brain Break</h1>
                        <p>Need a quick break? Take a short quiz to refresh your mind!</p>
                        <Button color="primary" size="lg" onClick={() => navigate('/quiz')}>
                            Take a Quiz
                        </Button>
                    </div>
                </Container>
            </section>
            <Footer />
        </>
    );
};

export default BrainBreak; 