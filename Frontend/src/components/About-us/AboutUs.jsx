import React from "react";
import "./about.css";
import { Container, Row, Col } from "reactstrap";
import aboutImg from "../../assests/images/about-us.png";
import CountUp from "react-countup";
import "./about.css";

const AboutUs = () => {
  return (
    <section id="about">
      <Container>
        <Row>
          <Col lg="6" md="6">
            <div className="about__img">
              <img src={aboutImg} alt="" className="w-100" />
            </div>
          </Col>

          <Col lg="6" md="6">
            <div className="about__content">
              <h2>About Us</h2>
              <p>
                Our Educational Blog Application is an interactive platform designed to foster learning through shared knowledge and personalized content. 
                Users can log in securely using Google or email, create and explore educational blog posts, and access tailored learning suggestions through the Personalized Learning Generator.
                 To promote balanced study habits, the application also features a Brain Break Puzzle section, offering fun and engaging mini-games. 
                 Built using React.js, Node.js, Express.js, and MongoDB, the platform combines functionality and user experience to support a modern, student-focused learning environment.
              </p>

            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutUs;
