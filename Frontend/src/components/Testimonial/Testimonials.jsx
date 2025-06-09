import React from "react";
import "./testimonial.css";
import { Container, Row, Col } from "reactstrap";
import Slider from "react-slick";

import img from "../../assests/images/testimonial01.png";

const Testimonials = () => {
  const settings = {
    infinite: true,
    dots: true,
    speed: 500,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToScroll: 1,
  };

  return (
    <section id="testimonials">
      <Container>
        <Row>
          <Col lg="10" md="12" className="m-auto">
            <div className="testimonial__wrapper d-flex justify-content-between align-items-center">
              <div className="testimonial__img w-50">
                <img src={img} alt="" className="w-100" />
              </div>

              <div className="testimonial__content w-50">
                <h2 className="mb-4">What Our Students Say</h2>

                <Slider {...settings}>
                  <div>
                    <div className="single__testimonial">
                      <h6 className="mb-3 fw-bold">Fantastic Learning Experience!</h6>
                      <p>
                        The course material was well-organized, and the instructors were
                        highly knowledgeable. I gained practical skills that I can immediately
                        apply to my work. The support from the community was also amazing!
                      </p>

                      <div className="student__info mt-4">
                        <h6 className="fw-bold">Alice Johnson</h6>
                        <p>New York, United States</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="single__testimonial">
                      <h6 className="mb-3 fw-bold">Highly Recommended!</h6>
                      <p>
                        I highly recommend this course to anyone looking to enhance their skills.
                        The lessons were clear, and the hands-on projects were extremely helpful.
                        The best part was the personalized feedback from the instructors.
                      </p>

                      <div className="student__info mt-4">
                        <h6 className="fw-bold">Michael Lee</h6>
                        <p>Los Angeles, United States</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="single__testimonial">
                      <h6 className="mb-3 fw-bold">Great Experience!</h6>
                      <p>
                        The course exceeded my expectations! The modules were engaging and easy
                        to follow. I particularly appreciated the quizzes and exercises, which
                        helped reinforce the concepts.
                      </p>

                      <div className="student__info mt-4">
                        <h6 className="fw-bold">Sophia Davis</h6>
                        <p>Texas, United States</p>
                      </div>
                    </div>
                  </div>
                </Slider>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Testimonials;
