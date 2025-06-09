import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/BlogPage.css';

// API base URL with fallback
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002';

const BlogPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/blogs`);
                setBlogs(response.data);
                
                // Extract unique categories
                const uniqueCategories = [...new Set(response.data.map(blog => blog.category))];
                setCategories(['all', ...uniqueCategories]);
                
                setLoading(false);
            } catch (err) {
                console.error('Error fetching blogs:', err);
                setError('Failed to fetch blogs. Please make sure the backend server is running.');
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const filteredBlogs = selectedCategory === 'all' 
        ? blogs 
        : blogs.filter(blog => blog.category === selectedCategory);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="blog-page">
            <div className="blog-header">
                <h1>Educational Blog Posts</h1>
                <p>Discover insights, tips, and knowledge from our educational community</p>
            </div>

            <div className="category-filter">
                {categories.map(category => (
                    <button
                        key={category}
                        className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                ))}
            </div>
            
            <div className="blog-grid">
                {filteredBlogs.map((blog) => (
                    <div key={blog._id} className="blog-card">
                        {blog.image && (
                            <div className="blog-image">
                                <img src={blog.image} alt={blog.title} />
                            </div>
                        )}
                        <div className="blog-content">
                            <span className="blog-category">{blog.category}</span>
                            <h2>{blog.title}</h2>
                            <p>{blog.content.substring(0, 150)}...</p>
                            <div className="blog-footer">
                                <span className="blog-date">
                                    {new Date(blog.createdAt).toLocaleDateString()}
                                </span>
                                <button className="read-more">Read More</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogPage; 