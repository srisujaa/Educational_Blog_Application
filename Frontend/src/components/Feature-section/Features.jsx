import React from "react";
import { Container, Row, Col } from "reactstrap";
import "./features.css";

const FeatureData = [
  {
    title: "Quick Learning",
    desc: "Our platform offers a fast-paced learning experience, helping you acquire new skills in a short amount of time. Whether you're looking to enhance your career or explore a new field, our resources are designed for efficient learning.",
    icon: "ri-draft-line",
  },

  {
    title: "All Time Support",
    desc: "We provide round-the-clock support to ensure that you never face any roadblocks. Whether you have a question or need help with a project, our team is always available to assist you.",
    icon: "ri-discuss-line",
  },

  {
    title: "Certification",
    desc: "Earn industry-recognized certifications that validate your skills and expertise. Our certificates help you stand out in the job market and demonstrate your dedication to continuous learning.",
    icon: "ri-contacts-book-line",
  },
];

const Features = () => {
  return (
    <section>
      <Container>
        <Row>
          {FeatureData.map((item, index) => (
            <Col lg="4" md="6" key={index}>
              <div className="single__feature text-center px-4">
                <h2 className="mb-3">
                  <i className={item.icon}></i>
                </h2>
                <h6>{item.title}</h6>
                <p>{item.desc}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Features;
