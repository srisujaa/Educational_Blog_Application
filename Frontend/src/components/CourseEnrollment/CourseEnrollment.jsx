import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CourseEnrollment.css';

const CourseEnrollment = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        name: ''
    });

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/courses/${courseId}`);
                setCourse(response.data);
                
                // Check if current user is enrolled
                const user = JSON.parse(localStorage.getItem('user'));
                if (user && response.data.enrolledStudents.includes(user._id)) {
                    setIsEnrolled(true);
                }
            } catch (error) {
                setError('Failed to fetch course details');
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                setError('Please login to enroll in this course');
                return;
            }

            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 1500));

            const response = await axios.post(`http://localhost:5001/courses/${courseId}/enroll`, {
                userId: user._id
            });

            setSuccess('Successfully enrolled in the course!');
            setIsEnrolled(true);
            setShowPayment(false);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to enroll in course');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPaymentDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) return <div className="loading">Loading course details...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!course) return <div className="error">Course not found</div>;

    return (
        <div className="course-enrollment">
            <div className="course-header">
                <h1>{course.title}</h1>
                <p className="instructor">Instructor: {course.instructor}</p>
            </div>

            <div className="course-details">
                <img src={course.image || '/default-course.jpg'} alt={course.title} />
                <div className="course-info">
                    <p className="description">{course.description}</p>
                    <p className="price">Price: Free</p>
                    <p className="enrolled">Students Enrolled: {course.enrolledStudents.length}</p>
                </div>
            </div>

            {success && <div className="success-message">{success}</div>}
            
            {!isEnrolled && !showPayment ? (
                <button 
                    className="enroll-button"
                    onClick={() => setShowPayment(true)}
                    disabled={loading}
                >
                    Enroll Now
                </button>
            ) : showPayment ? (
                <div className="payment-container">
                    <h2>Complete Your Enrollment</h2>
                    <p className="payment-note">This course is free! Just fill in the payment details to complete enrollment.</p>
                    <form onSubmit={handlePaymentSubmit} className="payment-form">
                        <div className="form-group">
                            <label>Card Number</label>
                            <input
                                type="text"
                                name="cardNumber"
                                value={paymentDetails.cardNumber}
                                onChange={handleInputChange}
                                placeholder="1234 5678 9012 3456"
                                required
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Expiry Date</label>
                                <input
                                    type="text"
                                    name="expiryDate"
                                    value={paymentDetails.expiryDate}
                                    onChange={handleInputChange}
                                    placeholder="MM/YY"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>CVV</label>
                                <input
                                    type="text"
                                    name="cvv"
                                    value={paymentDetails.cvv}
                                    onChange={handleInputChange}
                                    placeholder="123"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Cardholder Name</label>
                            <input
                                type="text"
                                name="name"
                                value={paymentDetails.name}
                                onChange={handleInputChange}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <button type="submit" className="payment-button">
                            Complete Enrollment
                        </button>
                        <button 
                            type="button" 
                            className="cancel-button"
                            onClick={() => setShowPayment(false)}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            ) : (
                <div className="enrolled-message">
                    You are enrolled in this course!
                </div>
            )}

            <div className="course-lessons">
                <h2>Course Lessons</h2>
                {course.lessons.map((lesson, index) => (
                    <div key={index} className="lesson">
                        <h3>{lesson.title}</h3>
                        <p>{lesson.content}</p>
                        {isEnrolled && lesson.videoUrl && (
                            <video controls>
                                <source src={lesson.videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseEnrollment; 