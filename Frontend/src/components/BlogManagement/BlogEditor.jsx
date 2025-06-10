import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './BlogEditor.css';

const BlogEditor = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const API_URL = 'http://localhost:5003';
    
    const [blog, setBlog] = useState({
        title: '',
        content: '',
        category: '',
        image: null,
        status: 'draft'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    const categories = ['Technology', 'Education', 'Programming', 'Career', 'Machine Learning','AI', 'Other'];

    useEffect(() => {
        // Load current user from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        setCurrentUser(user);
        
        if (id) {
            fetchBlog();
        }
    }, [id]);

    const fetchBlog = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                }
            };
            console.log('Attempting to fetch blog details for ID:', id, 'with config:', config); // Debug log
            const response = await axios.get(`${API_URL}/blogs/${id}`, config);
            console.log('Successfully fetched blog details:', response.data); // Debug log
            setBlog(response.data);
            if (response.data.image) {
                setImagePreview(`${API_URL}/${response.data.image}`);
            }
        } catch (error) {
            console.error('Error fetching blog details:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                setError(`Failed to fetch blog details: ${error.response.status} ${error.response.data.message || error.response.statusText}`);
            } else if (error.request) {
                console.error('Error request (no response):', error.request);
                setError('Failed to fetch blog details: No response from server. Please check backend.');
            } else {
                console.error('Error message:', error.message);
                setError(`Failed to fetch blog details: ${error.message}`);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBlog(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBlog(prev => ({
                ...prev,
                image: file
            }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please login to create a blog post');
                navigate('/login');
                return;
            }

            if (!currentUser) {
                setError('User information not found. Please login again.');
                navigate('/login');
                return;
            }

            const formData = new FormData();
            formData.append('title', blog.title);
            formData.append('content', blog.content);
            formData.append('category', blog.category);
            formData.append('status', blog.status);
            formData.append('author', currentUser._id);
            
            if (blog.image) {
                formData.append('image', blog.image);
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };

            if (id) {
                await axios.put(`${API_URL}/blogs/${id}`, formData, config);
            } else {
                await axios.post(`${API_URL}/blogs`, formData, config);
            }

            navigate('/blogs');
        } catch (error) {
            console.error('Error saving blog:', error);
            setError(error.response?.data?.message || 'Failed to save blog. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <section className="blog-editor-section">
                <Container>
                    <div className="blog-editor-header">
                        <h1>{id ? 'Edit Blog Post' : 'Create New Blog Post'}</h1>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <Form onSubmit={handleSubmit} className="blog-editor-form">
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                name="title"
                                value={blog.title}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter blog title"
                            />
                        </div>

                        <div className="form-group">
                            <label>Category</label>
                            <select
                                name="category"
                                value={blog.category}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Content</label>
                            <textarea
                                name="content"
                                value={blog.content}
                                onChange={handleInputChange}
                                required
                                rows="10"
                                placeholder="Write your blog content here..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {imagePreview && (
                                <div className="image-preview">
                                    <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Status</label>
                            <select
                                name="status"
                                value={blog.status}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>

                        <div className="form-actions">
                            <Button
                                type="button"
                                color="secondary"
                                onClick={() => navigate('/blogs')}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                color="primary"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : (id ? 'Update' : 'Create')}
                            </Button>
                        </div>
                    </Form>
                </Container>
            </section>
            <Footer />
        </>
    );
};

export default BlogEditor; 