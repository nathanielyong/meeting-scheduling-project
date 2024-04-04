import React, { useState } from 'react';
import axios from 'axios';

function RegisterPage() {
  const [errors, setErrors] = useState([])

  const [formData, setFormData] = useState({
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
      // Handle successful response, redirect, show success message, etc.
    } catch (error) {
      console.error('An error occurred:', error.response.data);
      // Handle error, show error message, etc.
    }
  };

  return (
    <div>
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
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
