import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Header from "../Header/Header";
import "./Login.css";

const API_URL = "http://localhost:5003";

const Login = () => {
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
      console.log('Attempting to login with:', { 
        email: formData.email,
        password: '***'
      });
      
      const response = await axios.post(`${API_URL}/login`, formData);
      console.log('Login response:', response.data); // Debug log
      
      if (response.data.user && response.data.user._id) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/");
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      console.error('Login error:', err);
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
      <div className="login-container">
        <div className="login-box">
          <h2>Login</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
