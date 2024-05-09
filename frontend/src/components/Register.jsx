import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_verify: '',
    first_name: '',
    last_name: ''
  });

  const [formErrors, setFormErrors] = useState({
    username: '',
    email: '',
    password: '',
    password_verify: '',
    first_name: '',
    last_name: ''
  });


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
      const response = await axios.post('http://127.0.0.1:8000/accounts/register/', formData);
      console.log(response.data);
      navigate("/accounts/login")
    } catch (error) {
      let errors = error.response.data;
      navigate("/accounts/login")
      setFormErrors({
        username: errors.username ? errors.username[0] : '',
        email: errors.email ? errors.email[0] : '',
        password: errors.password ? errors.password[0] : '',
        password_verify: errors.password_verify ? errors.password_verify[0] : '',
        first_name: errors.first_name ? errors.first_name[0] : '',
        last_name: errors.last_name ? errors.last_name[0] : ''
      });
    }
  };

  return (
    <div className="form-container">
      <h1>Register</h1>
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
          {formErrors.username && <div className="error">{formErrors.username}</div>}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {formErrors.email && <div className="error">{formErrors.email}</div>}
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
          {formErrors.password && <div className="error">{formErrors.password}</div>}
        </div>
        <div>
          <label htmlFor="password_verify">Verify Password:</label>
          <input
            type="password"
            id="password_verify"
            name="password_verify"
            value={formData.password_verify}
            onChange={handleChange}
            required
          />
          {formErrors.password_verify && <div className="error">{formErrors.password_verify}</div>}
        </div>
        <div>
          <label htmlFor="first_name">First Name:</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          {formErrors.first_name && <div className="error">{formErrors.first_name}</div>}
        </div>
        <div>
          <label htmlFor="last_name">Last Name:</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          {formErrors.last_name && <div className="error">{formErrors.last_name}</div>}
        </div>
        <button type="submit">Register</button>
      </form>
      <div className="login-link">
        Already have an account? <a href="/accounts/login">Login</a>
      </div>
    </div>
  );
}

export default Register;
