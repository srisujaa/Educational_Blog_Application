import React from 'react';
import { Container } from 'reactstrap';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './LearningPath.css';

const LearningPath = () => {
    return (
        <>
            <Header />
            <section className="learning-path-section">
                <Container>
                    <div className="learning-path-container">
                        <h1>Learning Path Generator</h1>
                        <p>Coming soon! This feature will help you create personalized learning paths based on your interests and goals.</p>
                    </div>
                </Container>
            </section>
            <Footer />
        </>
    );
};

export default LearningPath; 