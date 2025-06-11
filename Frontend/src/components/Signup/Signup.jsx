import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Header from "../Header/Header";
import "./Signup.css";

const API_URL = "http://localhost:5003";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
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

    // Validate input
    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting to sign up with:', { 
        name: formData.name,
        email: formData.email,
        password: '***'
      });

      const config = {
        headers: {
          'Content-Type': 'application/json',
        }
      };

      const response = await axios.post(
        `${API_URL}/signup`,
        formData,
        config
      );

      console.log('Signup response:', response.data);

      if (response.data.user && response.data.user._id) {
        alert("Signup successful! Please login to continue.");
        navigate("/login");
      } else {
        console.error('Invalid response format:', response.data);
        setError("Invalid response from server");
      }
    } catch (err) {
      console.error('Signup error:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        setError(err.response.data.message || "Signup failed. Please try again.");
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError("No response from server. Please try again.");
      } else {
        console.error('Error setting up request:', err.message);
        setError("Error setting up request. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="signup-container">
        <div className="signup-box">
          <h2>Sign Up</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="name" 
              placeholder="Full Name" 
              onChange={handleChange} 
              value={formData.name}
              required 
              disabled={loading}
            />
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
              minLength={6}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
