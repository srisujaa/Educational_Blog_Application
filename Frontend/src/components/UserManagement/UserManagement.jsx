import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserManagement.css';
import Header from '../Header/Header';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const API_URL = 'http://localhost:5003';

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setCurrentUser(user);
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            };
            const response = await axios.get(`${API_URL}/users`, config);
            setUsers(response.data);
            setError('');
        } catch (error) {
            console.error('Error fetching users:', error);
            setError(error.response?.data?.message || 'Failed to fetch users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            };
            if (editingId) {
                await axios.put(`${API_URL}/users/${editingId}`, formData, config);
                setSuccess('User updated successfully');
            } else {
                await axios.post(`${API_URL}/signup`, formData, config);
                setSuccess('User created successfully');
            }
            setFormData({ name: '', email: '', password: '' });
            setEditingId(null);
            fetchUsers();
            setError('');
        } catch (error) {
            console.error('Error in form submission:', error);
            setError(error.response?.data?.message || 'Operation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setFormData({
            name: user.name,
            email: user.email,
            password: ''
        });
        setEditingId(user._id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                };
                await axios.delete(`${API_URL}/users/${id}`, config);
                setSuccess('User deleted successfully');
                fetchUsers();
                setError('');
            } catch (error) {
                console.error('Error deleting user:', error);
                setError(error.response?.data?.message || 'Failed to delete user. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            <Header />
            <div className="user-management-container">
                <h2>User Management</h2>
                
                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                
                <div className="user-form-container">
                    <h3>{editingId ? 'Edit User' : 'Create New User'}</h3>
                    <form onSubmit={handleSubmit} className="user-form">
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required={!editingId}
                                disabled={loading}
                            />
                        </div>
                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : (editingId ? 'Update User' : 'Create User')}
                            </button>
                            {editingId && (
                                <button 
                                    type="button" 
                                    className="btn-secondary"
                                    onClick={() => {
                                        setEditingId(null);
                                        setFormData({ name: '', email: '', password: '' });
                                    }}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="users-list-container">
                    <h3>Users List</h3>
                    {loading ? (
                        <div className="loading">Loading users...</div>
                    ) : users.length === 0 ? (
                        <div className="no-users">No users found</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user._id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td className="actions">
                                                {currentUser && currentUser.role === 'admin' && currentUser._id !== user._id && (
                                                    <>
                                                        <button 
                                                            className="btn-edit"
                                                            onClick={() => handleEdit(user)}
                                                            disabled={loading}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button 
                                                            className="btn-delete"
                                                            onClick={() => handleDelete(user._id)}
                                                            disabled={loading}
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                                {currentUser && currentUser.role === 'admin' && currentUser._id === user._id && (
                                                    <span style={{ color: '#6c757d' }}>Cannot delete self</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default UserManagement;