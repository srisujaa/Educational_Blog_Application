import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './BlogList.css';

const BlogList = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categories, setCategories] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    const API_URL = 'http://localhost:5003';

    useEffect(() => {
        // Load current user from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        setCurrentUser(user);
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await axios.get(`${API_URL}/blogs`);
            if (response.data && Array.isArray(response.data)) {
                setBlogs(response.data);
                // Extract unique categories
                const uniqueCategories = [...new Set(response.data.map(blog => blog.category))];
                setCategories(uniqueCategories);
                setError('');
            } else {
                setError('Invalid response format from server');
                setBlogs([]);
            }
        } catch (error) {
            setError('Failed to fetch blogs. Please try again later.');
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (blogId) => {
        if (window.confirm('Are you sure you want to delete this blog post?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_URL}/blogs/${blogId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBlogs(blogs.filter(blog => blog._id !== blogId));
            } catch (error) {
                setError('Failed to delete blog post. Please try again.');
            }
        }
    };

    const isBlogAuthor = (blog) => {
        return currentUser && blog.author && blog.author._id === currentUser._id;
    };

    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            blog.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <>
            <Header />
            <section className="blog-list-section">
                <Container>
                    <div className="blog-list-header">
                        <h1>Educational Blog Posts</h1>
                        <p>Explore our collection of educational articles and resources</p>
                        <div className="header-actions">
                            <Button
                                color="primary"
                                className="create-blog-btn"
                                onClick={() => navigate('/blogs/create')}
                            >
                                Create New Blog Post
                            </Button>
                            <Button
                                color="info"
                                className="learning-path-btn"
                                onClick={() => navigate('/learning-path')}
                            >
                                Try Learning Path Generator
                            </Button>
                        </div>
                    </div>

                    <div className="blog-filters">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Search blogs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="category-filter">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="all">All Categories</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    {loading ? (
                        <div className="loading">Loading blogs...</div>
                    ) : filteredBlogs.length === 0 ? (
                        <div className="no-blogs">No blogs found matching your criteria</div>
                    ) : (
                        <Row>
                            {filteredBlogs.map((blog) => (
                                <Col lg="4" md="6" key={blog._id}>
                                    <div className="blog-card">
                                        {blog.image && (
                                            <div className="blog-image">
                                                <img src={`${API_URL}/${blog.image}`} alt={blog.title} />
                                            </div>
                                        )}
                                        <div className="blog-content">
                                            <div className="blog-category">{blog.category}</div>
                                            <h3>{blog.title}</h3>
                                            <p>{blog.content.substring(0, 150)}...</p>
                                            <div className="blog-actions">
                                                <Link to={`/blogs/${blog._id}`} className="read-more">
                                                    Read More
                                                </Link>
                                                {isBlogAuthor(blog) && (
                                                    <div className="admin-actions">
                                                        <Button
                                                            color="info"
                                                            size="sm"
                                                            onClick={() => navigate(`/blogs/edit/${blog._id}`)}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            color="danger"
                                                            size="sm"
                                                            onClick={() => handleDelete(blog._id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Container>
            </section>
            <Footer />
        </>
    );
};

export default BlogList; 