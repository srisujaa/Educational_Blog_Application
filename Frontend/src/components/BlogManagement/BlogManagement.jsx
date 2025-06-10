import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import './BlogManagement.css';

const BlogManagement = () => {
    const [blogs, setBlogs] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        content: '',
        image: null,
        published: false
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [user, setUser] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const navigate = useNavigate();

    const API_URL = 'http://localhost:5003';

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Failed to parse user from localStorage:', error);
                localStorage.removeItem('user');
            }
        }
        fetchBlogs();
    }, []);

    const checkAuth = () => {
        if (!user) {
            setError('Please login to perform this action');
            navigate('/login');
            return false;
        }
        return true;
    };

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            const response = await axios.get(`${API_URL}/blogs`, config);
            console.log('Blogs fetched:', response.data);
            
            if (response.data && Array.isArray(response.data)) {
                setBlogs(response.data);
                setError('');
            } else {
                console.error('Invalid response format:', response.data);
                setError('Invalid response format from server');
                setBlogs([]);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
            console.error('Error response:', error.response?.data);
            setError('Failed to fetch blogs. Please make sure the backend server is running.');
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                image: file
            });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please login to perform this action');
                navigate('/login');
                return;
            }
            
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('content', formData.content);
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }
            // Ensure published is sent as a string "true" or "false"
            formDataToSend.append('published', formData.published ? 'true' : 'false');

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };

            if (editingId) {
                await axios.put(`${API_URL}/blogs/${editingId}`, formDataToSend, config);
            } else {
                await axios.post(`${API_URL}/blogs`, formDataToSend, config);
            }

            setSuccess('Blog saved successfully!');
            setFormData({ title: '', category: '', content: '', image: null, published: false });
            setEditingId(null);
            setPreviewImage(null);
            setShowCreateForm(false);
            fetchBlogs();
            setError('');
        } catch (error) {
            console.error('Error in form submission:', error);
            setError(error.response?.data?.message || 'Operation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (blog) => {
        setEditingId(blog._id);
        setFormData({
            title: blog.title,
            category: blog.category,
            content: blog.content,
            image: blog.image, // Keep existing image path for display, but don't send if no new file is selected
            published: blog.published // Populate published status
        });
        if (blog.image) {
            setPreviewImage(`${API_URL}/${blog.image}`);
        } else {
            setPreviewImage(null);
        }
        setShowCreateForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                await axios.delete(`${API_URL}/blogs/${id}`, config);
                setSuccess('Blog deleted successfully');
                fetchBlogs();
                setError('');
            } catch (error) {
                console.error('Error deleting blog:', error);
                setError(error.response?.data?.message || 'Failed to delete blog. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            <Header />
            <div className="blog-management-container">
                <h2>Blog Management</h2>
                
                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                
                {user && (
                    <div className="admin-blog-sections">
                        <div className="blog-action-buttons">
                            <button 
                                className="btn btn-primary" 
                                onClick={() => {
                                    setShowCreateForm(!showCreateForm);
                                    setEditingId(null);
                                    setFormData({ title: '', category: '', content: '', image: null, published: false });
                                    setPreviewImage(null);
                                }}
                            >
                                {showCreateForm ? "View All Blogs" : "Create New Blog"}
                            </button>
                        </div>

                        {showCreateForm ? (
                            <div className="blog-form-container">
                                <h3>{editingId ? 'Edit Blog' : 'Create New Blog'}</h3>
                                <form onSubmit={handleSubmit} className="blog-form">
                                    <div className="form-group">
                                        <label>Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Enter blog title"
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Category</label>
                                        <input
                                            type="text"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Enter blog category"
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Content</label>
                                        <textarea
                                            name="content"
                                            value={formData.content}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Enter blog content"
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Image</label>
                                        <input
                                            type="file"
                                            onChange={handleImageChange}
                                            accept="image/*"
                                            disabled={loading}
                                        />
                                        {previewImage && (
                                            <img
                                                src={previewImage}
                                                alt="Preview"
                                                className="image-preview"
                                            />
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="published"
                                                checked={formData.published}
                                                onChange={handleInputChange}
                                                disabled={loading}
                                            />
                                            Published
                                        </label>
                                    </div>
                                    <div className="form-actions">
                                        <button type="submit" className="btn-primary" disabled={loading}>
                                            {loading ? 'Saving...' : (editingId ? 'Update Blog' : 'Create Blog')}
                                        </button>
                                        {editingId && (
                                            <button 
                                                type="button" 
                                                className="btn-secondary"
                                                onClick={() => {
                                                    setEditingId(null);
                                                    setFormData({ title: '', category: '', content: '', image: null, published: false });
                                                    setPreviewImage(null);
                                                    setShowCreateForm(false);
                                                }}
                                                disabled={loading}
                                            >
                                                Cancel Edit
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="blogs-list-management">
                                <h3>All Blogs</h3>
                                {loading ? (
                                    <div className="loading">Loading blogs...</div>
                                ) : blogs.length === 0 ? (
                                    <div className="no-blogs">No blogs found. Create one!</div>
                                ) : (
                                    <div className="blogs-grid">
                                        {blogs.map((blog) => (
                                            <div className="blog-card-management" key={blog._id}>
                                                <div className="blog-category-management">{blog.category}</div>
                                                <div className="blog-image-management">
                                                    {blog.image ? (
                                                        <img 
                                                            src={`${API_URL}/${blog.image}`}
                                                            alt={blog.title} 
                                                        />
                                                    ) : (
                                                        <div className="image-placeholder-management">No Image Available</div>
                                                    )}
                                                </div>
                                                <div className="blog-content-management">
                                                    <h4>{blog.title}</h4>
                                                    <p>{blog.content.substring(0, 100)}...</p>
                                                    <p className="blog-status">Status: {blog.published ? 'Published' : 'Draft'}</p>
                                                    <div className="blog-actions-management">
                                                        <button
                                                            className="btn btn-info btn-sm"
                                                            onClick={() => handleEdit(blog)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => handleDelete(blog._id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default BlogManagement;