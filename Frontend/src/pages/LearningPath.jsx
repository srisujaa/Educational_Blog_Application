import React from 'react';
import { Container } from 'reactstrap';
import Footer from '../components/Footer/Footer';
import LearningPathGenerator from '../components/LearningPath/LearningPathGenerator';
import './LearningPath.css';

const LearningPath = () => {
    return (
        <>
            <section className="learning-path-section">
                <Container>
                    <LearningPathGenerator />
                </Container>
            </section>
            <Footer />
        </>
    );
};

export default LearningPath; 