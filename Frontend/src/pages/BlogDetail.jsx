import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
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
            const response = await axios.get(`${API_URL}/blogs/${id}`);
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

                        {blog.image && (
                            <div className="blog-image">
                                <img src={`${API_URL}/${blog.image}`} alt={blog.title} />
                            </div>
                        )}

                        <div className="blog-content">
                            {blog.title === 'Understanding Machine Learning Algorithms' ? (
                                <>
                                    <p>Machine learning is a subset of artificial intelligence that focuses on developing systems that can learn from and make decisions based on data. In today's data-driven world, machine learning algorithms are at the heart of many applications, from recommendation systems to self-driving cars.</p>
                                    <h3>Types of Machine Learning Algorithms</h3>
                                    <ul>
                                        <li><strong>Supervised Learning:</strong> Algorithms learn from labeled data. Common algorithms include Linear Regression, Logistic Regression, Decision Trees, Random Forests, Support Vector Machines, and Neural Networks. Applications: spam detection, image classification, and medical diagnosis.</li>
                                        <li><strong>Unsupervised Learning:</strong> Algorithms find patterns in unlabeled data. Popular algorithms are K-Means Clustering, Hierarchical Clustering, and Principal Component Analysis (PCA). Applications: customer segmentation, anomaly detection, and data compression.</li>
                                        <li><strong>Reinforcement Learning:</strong> Algorithms learn by interacting with an environment and receiving feedback. Examples include Q-Learning and Deep Q-Networks. Applications: robotics, game playing (like AlphaGo), and autonomous vehicles.</li>
                                    </ul>
                                    <h3>How Do These Algorithms Work?</h3>
                                    <p>Supervised learning uses historical data to predict future outcomes. Unsupervised learning uncovers hidden patterns or groupings in data. Reinforcement learning optimizes actions based on trial and error to maximize rewards.</p>
                                    <h3>Choosing the Right Algorithm</h3>
                                    <ul>
                                        <li>Understand your data: Is it labeled or unlabeled?</li>
                                        <li>Define your goal: Classification, regression, clustering, or control?</li>
                                        <li>Consider interpretability, accuracy, and computational resources.</li>
                                    </ul>
                                    <h3>Applications of Machine Learning</h3>
                                    <ul>
                                        <li>Healthcare: Disease prediction, personalized medicine</li>
                                        <li>Finance: Fraud detection, algorithmic trading</li>
                                        <li>Retail: Recommendation engines, inventory management</li>
                                        <li>Transportation: Self-driving cars, route optimization</li>
                                    </ul>
                                    <p>Whether you're a beginner or an experienced data scientist, understanding these core concepts will help you navigate the rapidly evolving field of machine learning and apply the right techniques to your own projects.</p>
                                </>
                            ) : (
                                blog.content.split('\n').map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))
                            )}
                            <div className="blog-elaboration">
                                <h3>What is {blog.title}?</h3>
                                <p>This article explores the topic of <strong>{blog.title}</strong> in the field of <strong>{blog.category}</strong>. Understanding this topic is essential for anyone interested in expanding their knowledge and skills in this area.</p>
                                <h3>Key Concepts</h3>
                                <ul>
                                    <li>Definition and importance of {blog.title}</li>
                                    <li>Core principles and foundational ideas</li>
                                    <li>Common challenges and misconceptions</li>
                                </ul>
                                <h3>Applications</h3>
                                <ul>
                                    <li>How {blog.title} is used in real-world scenarios</li>
                                    <li>Industry examples and case studies</li>
                                    <li>Emerging trends in {blog.category}</li>
                                </ul>
                                <h3>Tips for Learners</h3>
                                <ul>
                                    <li>Start with the basics and build a strong foundation</li>
                                    <li>Practice regularly and apply concepts to projects</li>
                                    <li>Stay updated with the latest developments in {blog.category}</li>
                                </ul>
                                <p>By exploring these sections, you'll gain a deeper understanding of <strong>{blog.title}</strong> and how it fits into the broader context of <strong>{blog.category}</strong>.</p>
                            </div>
                        </div>

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