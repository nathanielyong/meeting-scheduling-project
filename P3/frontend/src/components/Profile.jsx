import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import './Profile.css';
import profileImage from './images/profile.png';
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('http://127.0.0.1:8000/accounts/profile/view/');
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  const handleEditProfile = () => {
    // Implement your edit profile logic here
    console.log('Edit Profile clicked');
    navigate("/accounts/profile/edit");
  };

  const handleSetAvailabilities = () => {
    // Implement your set availabilities logic here
    console.log('Set Availabilities clicked');
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        {userData && (
          <img src={profileImage} alt="Profile" className="profile-image" />
        )}
        {userData ? (
          <div className="profile-data">
            <p><span className="data-label">Username:</span> {userData.username}</p>
            <p><span className="data-label">Email:</span> {userData.email}</p>
            <p><span className="data-label">First Name:</span> {userData.first_name}</p>
            <p><span className="data-label">Last Name:</span> {userData.last_name}</p>
          </div>
        ) : (
          <p className="loading-text">Loading user data...</p>
        )}
      </div>
      <div className="profile-actions">
        <button className="edit-profile-btn" onClick={handleEditProfile}>
          Edit Profile
        </button>
        <button className="set-availabilities-btn" onClick={handleSetAvailabilities}>
          Set Availabilities
        </button>
      </div>
    </div>
  );
};

export default Profile;
