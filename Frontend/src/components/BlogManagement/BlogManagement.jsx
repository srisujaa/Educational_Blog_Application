import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
            console.log('Fetching blogs from:', `${API_URL}/blogs`);
            const response = await axios.get(`${API_URL}/blogs`);
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
        if (!checkAuth()) return;
        
        setLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('content', formData.content);
            formDataToSend.append('published', formData.published);
            formDataToSend.append('author', user._id);

            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            let response;
            if (editingId) {
                response = await axios.put(`${API_URL}/blogs/${editingId}`, formDataToSend);
                setSuccess('Blog updated successfully');
            } else {
                response = await axios.post(`${API_URL}/blogs`, formDataToSend);
                setSuccess('Blog created successfully');
            }

            setFormData({
                title: '',
                category: '',
                content: '',
                image: null,
                published: false
            });
            setPreviewImage(null);
            setEditingId(null);
            await fetchBlogs();
            setError('');
        } catch (error) {
            setError(error.response?.data?.message || 'Operation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (blog) => {
        if (!checkAuth()) return;
        
        setFormData({
            title: blog.title,
            category: blog.category,
            content: blog.content,
            image: null,
            published: blog.published
        });
        setPreviewImage(blog.image ? `${API_URL}/${blog.image}` : null);
        setEditingId(blog._id);
    };

    const handleDelete = async (id) => {
        if (!checkAuth()) return;
        
        if (window.confirm('Are you sure you want to delete this blog?')) {
            setLoading(true);
            try {
                await axios.delete(`${API_URL}/blogs/${id}`);
                setSuccess('Blog deleted successfully');
                fetchBlogs();
                setError('');
            } catch (error) {
                setError('Failed to delete blog. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="blog-management-container">
            <h2>Blog Management</h2>
            
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            
            {user && (
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
                        <button type="submit" disabled={loading}>
                            {loading ? 'Processing...' : (editingId ? 'Update Blog' : 'Create Blog')}
                        </button>
                    </form>
                </div>
            )}

            <div className="blogs-list">
                <h3>All Blogs</h3>
                {blogs.map((blog) => (
                    <div key={blog._id} className="blog-item">
                        <h4>{blog.title}</h4>
                        <p><strong>Category:</strong> {blog.category}</p>
                        <p><strong>Content:</strong> {blog.content.substring(0, 200)}...</p>
                        {blog.image && (
                            <img
                                src={`${API_URL}/${blog.image}`}
                                alt={blog.title}
                                className="blog-image"
                            />
                        )}
                        <p><strong>Status:</strong> {blog.published ? 'Published' : 'Draft'}</p>
                        {user && (
                            <div className="blog-actions">
                                <button
                                    onClick={() => handleEdit(blog)}
                                    disabled={loading}
                                    className="edit-btn"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(blog._id)}
                                    disabled={loading}
                                    className="delete-btn"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogManagement; 