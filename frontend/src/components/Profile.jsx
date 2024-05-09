import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import './Profile.css';
import profileImage from './images/profile.png';
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker';

const Profile = () => {
  const navigate = useNavigate();

  const [day, setDay] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [timeError, setTimeError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleDayChange = (day) => {
    setDay(day);
  };

  const formatDay = (date) => {

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
    if (endTime && event.target.value > endTime) {
      setTimeError('Start time cannot be after end time.');
    } else {
      setTimeError('');
    }

    if (successMessage){
      setSuccessMessage("");
    }
  };

  console.log(day);

  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
    if (startTime && event.target.value < startTime) {
      setTimeError('End time cannot be before start time.');
    } else {
      setTimeError('');
    }
    if (successMessage){
      setSuccessMessage("");
    }
  };

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
    console.log('Edit Profile clicked');
    navigate("/accounts/profile/edit");
  };

  const handleSetAvailabilities = async () => {

    if (startTime.trim() === '' || endTime.trim() === '') {
      setTimeError('Please provide both start time and end time.');
      return;
    }
    if (startTime > endTime) {
      setTimeError('End time cannot be before start time.');
      return;
    }
    setTimeError('');

    try {
      const response = await api.post(
        'http://127.0.0.1:8000/accounts/availabilities/add/ ',{
          start_time: formatDay(day) + " " + startTime,
          end_time: formatDay(day) + " " + endTime
        }
        
      );
      setSuccessMessage(response.data.message)
      console.log('Profile updated successfully:', response.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const handleClearFields = () => {
    setDay(new Date());
    setStartTime('');
    setEndTime('');
    setTimeError('');
    setSuccessMessage('');
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
      </div>
      <div>
        <label>Select a Date:</label>
        <DatePicker
          selected={day}
          onChange={handleDayChange}
          dayFormat="yyyy-MM-dd"
        />
        <br />

        <label>Start Time:</label>
        <input
          type="time"
          value={startTime}
          onChange={handleStartTimeChange}
        />
        <br />

        <label>End Time:</label>
        <input
          type="time"
          value={endTime}
          onChange={handleEndTimeChange}
        />
        {timeError && <p className="error-message">{timeError}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <div className="btn-container">
          <button className="clear-fields-btn" onClick={handleClearFields}>
            Clear Fields
          </button>
          <button className="set-availabilities-btn" onClick={handleSetAvailabilities}>
            Set Availabilities
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
