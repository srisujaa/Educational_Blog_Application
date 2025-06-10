import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Header from "../Header/Header";
import "./AdminLogin.css";

const API_URL = "http://localhost:5003";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      console.log('Attempting admin login with:', { 
        email: formData.email,
        password: '***'
      });
      
      const response = await axios.post(`${API_URL}/login`, formData);
      console.log('Admin login response:', response.data);
      
      if (response.data.user && response.data.user._id) {
        if (response.data.user.role !== 'admin') {
          setError("Access denied. This is an admin-only login page.");
          return;
        }
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/admin-dashboard"); // Redirect to the new admin dashboard page
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      console.error('Admin login error:', err);
      if (err.response) {
        setError(err.response.data.message || "Invalid Credentials");
      } else if (err.request) {
        setError("No response from server. Please try again.");
      } else {
        setError("Error setting up request. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="admin-login-container">
        <div className="admin-login-box">
          <h2>Admin Login</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input 
              type="email" 
              name="email" 
              placeholder="Admin Email" 
              onChange={handleChange} 
              value={formData.email}
              required 
              disabled={loading}
            />
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              onChange={handleChange} 
              value={formData.password}
              required 
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Admin Login"}
            </button>
          </form>
          <p>Regular user? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 