// ViewProfile.jsx
import React, { useEffect, useState } from 'react'
import './ViewProfile.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ViewProfile() {
  const [doctorData, setDoctorData] = useState({
    name: "",
    email: "",
    mobile: "",
    gender: "",
    dob: "",
    qualification: "",
    specialization: "",
    experience: "",
    photo: ""
  });
  
  const [loading, setLoading] = useState(true);
  const [age, setAge] = useState(null);
  
  const apiUrl = import.meta.env.VITE_API_URL;
  const lid = sessionStorage.getItem("lid");
  const navigate = useNavigate();

  const fetchdata = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}drprofile/${lid}`);
      console.log(res.data);
      setDoctorData({
        name: res.data.name || "",
        email: res.data.email || "",
        mobile: res.data.mobile || "",
        gender: res.data.gender || "",
        dob: res.data.dob || "",
        qualification: res.data.qualification || "",
        specialization: res.data.specialization || "",
        experience: res.data.experience || "",
        photo: res.data.photo || ""
      });
      
      // Calculate age from DOB
      if (res.data.dob) {
        const birthDate = new Date(res.data.dob);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
        setAge(calculatedAge);
      }
      
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (lid) {
      fetchdata();
    }
  }, [lid]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getInitials = (name) => {
    if (!name) return 'D';
    return name.charAt(0).toUpperCase();
  };

  const handleEditProfile = () => {
    navigate('/drhome/editdrprof', { state: doctorData });
  };

  const getExperienceYears = () => {
    const exp = parseInt(doctorData.experience);
    if (isNaN(exp)) return 'Not specified';
    if (exp === 1) return '1 year';
    return `${exp} years`;
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Header Section */}
        <div className="profile-header">
          <div className="profile-avatar-large">
            {doctorData.photo ? (
              <img 
                src={`${apiUrl}${doctorData.photo}`} 
                alt={doctorData.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                }}
              />
            ) : (
              <div className="avatar-placeholder">
                <span>{getInitials(doctorData.name)}</span>
              </div>
            )}
          </div>
          <div className="profile-title">
            <h1>Dr. {doctorData.name}</h1>
            <p className="specialization-badge">
              <i className="fas fa-stethoscope"></i>
              {doctorData.specialization || 'General Physician'}
            </p>
            
          </div>
        </div>

        {/* Stats Section */}
        <div className="profile-stats">
          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-briefcase"></i>
            </div>
            <div className="stat-info">
              <h3>{getExperienceYears()}</h3>
              <p>Experience</p>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <div className="stat-info">
              <h3>{age ? `${age} years` : 'N/A'}</h3>
              <p>Age</p>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <div className="stat-info">
              <h3>{doctorData.qualification?.split(',')[0] || 'N/A'}</h3>
              <p>Qualification</p>
            </div>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="profile-details-grid">
          <div className="detail-card">
            <div className="detail-icon">
              <i className="fas fa-user"></i>
            </div>
            <div className="detail-content">
              <label>Full Name</label>
              <p>Dr. {doctorData.name}</p>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">
              <i className="fas fa-envelope"></i>
            </div>
            <div className="detail-content">
              <label>Email Address</label>
              <p>{doctorData.email || 'Not provided'}</p>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">
              <i className="fas fa-phone"></i>
            </div>
            <div className="detail-content">
              <label>Phone Number</label>
              <p>{doctorData.mobile || 'Not provided'}</p>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">
              <i className="fas fa-venus-mars"></i>
            </div>
            <div className="detail-content">
              <label>Gender</label>
              <p>{doctorData.gender || 'Not specified'}</p>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">
              <i className="fas fa-calendar"></i>
            </div>
            <div className="detail-content">
              <label>Date of Birth</label>
              <p>{formatDate(doctorData.dob)}</p>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <div className="detail-content">
              <label>Qualification</label>
              <p>{doctorData.qualification || 'Not specified'}</p>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">
              <i className="fas fa-stethoscope"></i>
            </div>
            <div className="detail-content">
              <label>Specialization</label>
              <p>{doctorData.specialization || 'General Medicine'}</p>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">
              <i className="fas fa-briefcase"></i>
            </div>
            <div className="detail-content">
              <label>Years of Experience</label>
              <p>{getExperienceYears()}</p>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
}

export default ViewProfile;