// ViewProfile.jsx - User Profile
import React, { useEffect, useState } from 'react'
import './ViewuserProfile.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function ViewProfile() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    mobile: "",
    gender: "",
    dob: "",
    place: "",
    pincode: "",
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
      const res = await axios.get(`${apiUrl}userprofile/${lid}`);
      console.log(res.data);
      setUserData({
        name: res.data.name || "",
        email: res.data.email || "",
        mobile: res.data.mobile || "",
        gender: res.data.gender || "",
        dob: res.data.dob || "",
        place: res.data.place || "",
        pincode: res.data.pincode || "",
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
    } else {
      navigate('/');
    }
  }, [lid]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  const handleEditProfile = () => {
    navigate('/userhome/editprf', { state: userData });
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
    <div className="user-profile-container">
      <div className="user-profile-card">
        {/* Header Section */}
        <div className="profile-header">
          <div className="profile-avatar-large">
            {userData.photo ? (
              <img 
                src={`${apiUrl}${userData.photo}`} 
                alt={userData.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/150?text=User';
                }}
              />
            ) : (
              <div className="avatar-placeholder">
                <span>{getInitials(userData.name)}</span>
              </div>
            )}
          </div>
          <div className="profile-title">
            <h1>{userData.name || 'Patient'}</h1>
            <p className="member-badge">
              <i className="fas fa-calendar-alt"></i>
              Member since {new Date().getFullYear()}
            </p>
            <div className="profile-actions">
              <button className="edit-profile-btn" onClick={handleEditProfile}>
                <i className="fas fa-edit"></i>
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="profile-stats">
          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-calendar"></i>
            </div>
            <div className="stat-info">
              <h3>{age ? `${age} years` : 'N/A'}</h3>
              <p>Age</p>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div className="stat-info">
              <h3>{userData.place || 'N/A'}</h3>
              <p>Location</p>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-venus-mars"></i>
            </div>
            <div className="stat-info">
              <h3>{userData.gender || 'N/A'}</h3>
              <p>Gender</p>
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
              <p>{userData.name || 'Not provided'}</p>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">
              <i className="fas fa-envelope"></i>
            </div>
            <div className="detail-content">
              <label>Email Address</label>
              <p>{userData.email || 'Not provided'}</p>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">
              <i className="fas fa-phone"></i>
            </div>
            <div className="detail-content">
              <label>Phone Number</label>
              <p>{userData.mobile || 'Not provided'}</p>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">
              <i className="fas fa-venus-mars"></i>
            </div>
            <div className="detail-content">
              <label>Gender</label>
              <p>{userData.gender || 'Not specified'}</p>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">
              <i className="fas fa-calendar"></i>
            </div>
            <div className="detail-content">
              <label>Date of Birth</label>
              <p>{formatDate(userData.dob)}</p>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div className="detail-content">
              <label>City / Location</label>
              <p>{userData.place || 'Not provided'}</p>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">
              <i className="fas fa-mail-bulk"></i>
            </div>
            <div className="detail-content">
              <label>Pincode</label>
              <p>{userData.pincode || 'Not provided'}</p>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">
              <i className="fas fa-id-card"></i>
            </div>
            <div className="detail-content">
              <label>Member ID</label>
              <p>#PAT-{lid?.slice(-6) || '000001'}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="profile-footer">
          <p>
            <i className="fas fa-shield-alt"></i>
            Your health data is protected and confidential
          </p>
        </div>
      </div>
    </div>
  );
}

export default ViewProfile;