import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                if (parsedUser.role !== 'admin') {
                    alert("Access denied. You are not an administrator.");
                    navigate('/'); // Redirect non-admins to home
                }
            } catch (error) {
                console.error("Failed to parse user from localStorage:", error);
                localStorage.removeItem('user'); // Clear corrupted data
                navigate('/login');
            }
        } else {
            navigate('/login'); // Redirect if no user is logged in
        }
    }, [navigate]);

    if (!user || user.role !== 'admin') {
        return null; // Or a loading spinner, or a specific unauthorized message
    }

    return (
        <>
            <Header />
            <div className="admin-dashboard-container">
                <h1>Admin Dashboard</h1>
                <p>Welcome, {user.name}!</p>
                <div className="dashboard-actions">
                    <button 
                        className="dashboard-button manage-blogs"
                        onClick={() => navigate('/blogs/manage')}
                    >
                        Manage Blogs
                    </button>
                    <button 
                        className="dashboard-button manage-users"
                        onClick={() => navigate('/users')}
                    >
                        Manage Users
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AdminDashboard; 