import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './BlogDetail.css';

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const API_URL = 'http://localhost:5003';

    useEffect(() => {
        fetchBlog();
    }, [id]);

    const fetchBlog = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                }
            };
            const response = await axios.get(`${API_URL}/blogs/${id}`, config);
            setBlog(response.data);
            setError('');
        } catch (error) {
            console.error('Error fetching blog:', error);
            setError('Failed to fetch blog details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="blog-detail-section">
                    <Container>
                        <div className="loading">Loading blog post...</div>
                    </Container>
                </div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="blog-detail-section">
                    <Container>
                        <div className="error-message">{error}</div>
                    </Container>
                </div>
                <Footer />
            </>
        );
    }

    if (!blog) {
        return (
            <>
                <Header />
                <div className="blog-detail-section">
                    <Container>
                        <div className="error-message">Blog post not found</div>
                    </Container>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <section className="blog-detail-section">
                <Container>
                    <div className="blog-detail-container">
                        <div className="blog-header">
                            <div className="blog-category">{blog.category}</div>
                            <h1>{blog.title}</h1>
                            <div className="blog-meta">
                                <span className="author">By {blog.author?.name || 'Anonymous'}</span>
                                <span className="date">
                                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                                <span className="read-time">{blog.readTime} min read</span>
                            </div>
                        </div>

                        <Row className="blog-content-image-layout">
                            <Col md="8">
                                <div className="blog-content">
                                    {blog.content.split('\n').map((paragraph, index) => (
                                        <p key={index}>{paragraph}</p>
                                    ))}
                                </div>
                            </Col>
                            <Col md="4">
                                {blog.image && (
                                    <div className="blog-image-detail">
                                        <img 
                                            src={`${API_URL}/${blog.image}`}
                                            alt={blog.title} 
                                        />
                                    </div>
                                )}
                            </Col>
                        </Row>

                        {blog.tags && blog.tags.length > 0 && (
                            <div className="blog-tags">
                                {blog.tags.map((tag, index) => (
                                    <span key={index} className="tag">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="blog-actions">
                            <button
                                className="back-button"
                                onClick={() => navigate('/blogs')}
                            >
                                Back to Blogs
                            </button>
                        </div>
                    </div>
                </Container>
            </section>
            <Footer />
        </>
    );
};

export default BlogDetail; 