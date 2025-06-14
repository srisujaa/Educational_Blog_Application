import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import chooseImg from "../../assests/images/why-choose-us.png";
import "./choose-us.css";
import ReactPlayer from "react-player";

const ChooseUs = () => {
  const [showVideo, setShowVideo] = useState(false);
  return (
    <section>
      <Container>
        <Row>
          <Col lg="6" md="6">
            <div className="choose__content">
              <h2>Why Choose Us</h2>
              <p>
                Our Educational Blog Application goes beyond just reading and writing blogs — it creates a complete learning ecosystem. 
                With features like personalized content recommendations, brain break puzzles for mental refreshment, and a clean, user-friendly design, we aim to make learning both effective and enjoyable.
                 Whether you're a student seeking insights, a teacher sharing knowledge, or a curious mind looking to grow, our platform adapts to your needs.
                 Secure login, modern tech, and interactive tools make us the smart choice for learners who want more than just a blog.
              </p>
            </div>
          </Col>

          <Col lg="6" md="6">
            <div className="choose__img">
              {showVideo ? (
                <ReactPlayer
                  url="https://www.youtube.com/watch?v=qFp27TR4Yew"
                  controls
                  width="100%"
                  height="350px"
                />
              ) : (
                <img src={chooseImg} alt="" className="w-100" />
              )}

              {!showVideo && (
                <span className="play__icon">
                  <i
                    className="ri-play-circle-line"
                    onClick={() => setShowVideo(!showVideo)}
                  ></i>
                </span>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ChooseUs;