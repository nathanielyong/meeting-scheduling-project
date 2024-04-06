import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState(null); // State to store errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/accounts/login/', formData);
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      navigate("/calendar");
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data["detail"]); // Setting errors from API response
        console.log(error.response.data["detail"]);
      }
    }
  };

  return (
    <div className="form-container">
      <h1>1on1</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {errors && (
        <div className="error-container">
          <p className="error">{errors}</p>
        </div>
      )}
      <div className="login-link">
        Don't have an account? <a href="/accounts/register">Register</a>
      </div>
    </div>
  );
}

export default Login;