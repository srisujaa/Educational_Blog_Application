import React from "react";
import { Link } from "react-router-dom";
import "./courses.css";

const CourseCard = ({ item }) => {
  const { title, lessons, enrolledStudents, _id } = item;

  return (
    <div className="course__item">
      <div className="course__details">
        <h6 className="course__title">{title}</h6>

        <div className="course__info">
          <p className="lesson">
            <i className="ri-book-open-line"></i> {lessons ? lessons.length : 0} Lessons
          </p>

          <p className="students">
            <i className="ri-user-line"></i> {enrolledStudents ? enrolledStudents.length : 0}
          </p>
        </div>

        <div className="course__rating">
          <p>
            <i className="ri-star-fill"></i> 4.8
          </p>
        </div>

        <div className="enroll">
          <Link to={`/courses/${_id}`} className="btn">
            Enroll Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
