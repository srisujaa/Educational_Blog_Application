import React from 'react';
import { Container, Button } from 'reactstrap';
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
                        <h1>Brain Break</h1>
                        <p>Take a short break and challenge your mind with our interactive quiz!</p>
                        <Button
                            color="primary"
                            size="lg"
                            className="start-quiz-btn"
                            onClick={() => navigate('/quiz')}
                        >
                            Start Quiz
                        </Button>
                    </div>
                </Container>
            </section>
            <Footer />
        </>
    );
};

export default BrainBreak; 