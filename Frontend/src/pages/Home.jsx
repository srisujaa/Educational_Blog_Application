import React, { Fragment } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { Link } from "react-router-dom";

import Header from "../components/Header/Header";
import HeroSection from "../components/Hero-Section/HeroSection";
import CompanySection from "../components/Company-section/Company";
import AboutUs from "../components/About-us/AboutUs";
import ChooseUs from "../components/Choose-us/ChooseUs";
import Features from "../components/Feature-section/Features";
import BrainBreak from "../components/BrainBreak/BrainBreak";
import Testimonials from "../components/Testimonial/Testimonials";
import Newsletter from "../components/Newsletter/Newsletter";
import Footer from "../components/Footer/Footer";
import "./Home.css";

const Home = () => {
  return (
    <Fragment>
      <Header />
      <HeroSection id="home" />
      <CompanySection />
      <AboutUs id="about" />
      <ChooseUs id="pages" />
      <Features id="blog" />
      <BrainBreak />
      
      {/* Learning Path Generator Promotion Section */}
      <section className="learning-path-promo">
        <Container>
          <Row className="align-items-center">
            <Col lg="6">
              <div className="promo-content">
                <h2>Personalized Learning Paths</h2>
                <p>Create your custom learning journey based on your interests, experience level, and available time. Our AI-powered Learning Path Generator helps you navigate through educational content in the most efficient way.</p>
                <ul className="feature-list">
                  <li>Tailored to your skill level</li>
                  <li>Time-based learning paths</li>
                  <li>Topic-based content curation</li>
                  <li>Progress tracking</li>
                </ul>
                <Link to="/learning-path">
                  <Button color="primary" size="lg" className="mt-3">
                    Try Learning Path Generator
                  </Button>
                </Link>
              </div>
            </Col>
            <Col lg="6">
              <div className="promo-image">
                <img src="/images/learning-path.png" alt="Learning Path Generator" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      <Testimonials />
      <Newsletter />
      <Footer />
    </Fragment>
  );
};

export default Home;
