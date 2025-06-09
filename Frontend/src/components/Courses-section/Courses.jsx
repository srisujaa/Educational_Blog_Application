import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import courseImg1 from "../../assests/images/web-design.png";
import courseImg2 from "../../assests/images/graphics-design.png";
import courseImg3 from "../../assests/images/ui-ux.png";
import "./courses.css";
import CourseCard from "./CourseCard";
import axios from "axios";

const API_URL = 'http://localhost:5003';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API_URL}/courses`);
        setCourses(response.data);
      } catch (error) {
        setError('Failed to fetch courses');
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <section id="coursesstart">
      <Container>
        <Row>
          <Col lg="12" className="mb-5">
            <div className="course__top d-flex justify-content-between align-items-center">
              <div className="course__top__left w-50">
                <h2>Our Popular Courses</h2>
                <p>
                  Explore our range of expertly designed courses tailored to
                  help you grow in your career. Whether you're a beginner or an
                  expert, we have something for everyone. Learn the latest skills
                  in web design, graphics, UI/UX, and more!
                </p>
              </div>

              <div className="w-50 text-end">
                <a href="#allcourses">
                  <button className="btn">See All</button>
                </a>
              </div>
            </div>
          </Col>
          {loading ? (
            <div className="loading">Loading courses...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            courses.map((course) => (
              <Col lg="4" md="6" sm="6" key={course._id}>
                <CourseCard item={course} />
              </Col>
            ))
          )}
        </Row>
      </Container>
    </section>
  );
};

export default Courses;
