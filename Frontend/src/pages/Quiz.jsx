import React from 'react';
import { Container } from 'reactstrap';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './Quiz.css';

const Quiz = () => {
    return (
        <>
            <Header />
            <section className="quiz-section">
                <Container>
                    <div className="quiz-container">
                        <h1>Quiz</h1>
                        <p>Coming soon! Test your knowledge with our interactive quizzes.</p>
                    </div>
                </Container>
            </section>
            <Footer />
        </>
    );
};

export default Quiz; 