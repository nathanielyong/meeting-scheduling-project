import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        password: null,
        password_verify: null,
    });

    const [formErrors, setFormErrors] = useState({
        email: '',
        password: '',
        password_verify: '',
        first_name: '',
        last_name: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get(
                    'http://127.0.0.1:8000/accounts/profile/view/'
                );
                const userData = response.data;
                setFormData({
                    email: userData.email,
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    password: '',
                    password_verify: '',
                });
            } catch (error) {
                console.error('Error fetching user data:', error);;
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        if (formData.password === '') {
            delete formData.password;
            delete formData.password_verify;
        }
        try {
            const response = await api.put(
                'http://127.0.0.1:8000/accounts/profile/edit/ ',
                formData
            );
            console.log('Profile updated successfully:', response.data);
            navigate('/accounts/profile/view');
        } catch (error) {
            let errors = error.response.data;
            setFormErrors({
                email: errors.email ? errors.email[0] : '',
                password: errors.password ? errors.password[0] : '',
                password_verify: errors.password_verify ? errors.password_verify[0] : '',
                first_name: errors.first_name ? errors.first_name[0] : '',
                last_name: errors.last_name ? errors.last_name[0] : ''
            });

        }
    };

    const handleBack = () => {
        navigate('/accounts/profile/view');
    };

    return (
        <div className="edit-profile-container">
            <h1>Edit Profile</h1>
            {
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {formErrors.email && <div className="error">{formErrors.email}</div>}
                    </div>
                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                        />
                        {formErrors.first_name && <div className="error">{formErrors.first_name}</div>}
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                        />
                        {formErrors.last_name && <div className="error">{formErrors.last_name}</div>}
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {formErrors.password && <div className="error">{formErrors.password}</div>}
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="password_verify"
                            value={formData.password_verify}
                            onChange={handleChange}
                        />
                        {formErrors.password_verify && <div className="error">{formErrors.password_verify}</div>}
                    </div>
                    <div className="btn-container">
                        <button type="button" onClick={handleBack} className="back-btn">
                            Back
                        </button>
                        <button type="submit" className="save-btn">
                            Save
                        </button>
                    </div>
                </form>
            }
        </div>
    );
};

export default EditProfile;
