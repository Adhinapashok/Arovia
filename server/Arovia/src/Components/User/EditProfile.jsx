// EditProfile.jsx
import React, { useState, useEffect } from 'react';
import './SignUp.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function EditProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = location.state || {};

  const [formData, setFormData] = useState({
    name: userData.name || "",
    email: userData.email || "",
    mobile: userData.mobile || "",
    place: userData.place || "",
    pincode: userData.pincode || "",
    gender: userData.gender || "",
    dob: userData.dob || "",
    photo: null,
    existingPhoto: userData.photo || ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const lid = sessionStorage.getItem("lid");

  useEffect(() => {
    if (!userData.name && lid) {
      fetchUserData();
    } else if (userData.photo) {
      setPreviewImage(`${apiUrl}${userData.photo}`);
    }
  }, [userData, lid]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}userprofile/${lid}`);
      setFormData({
        name: res.data.name || "",
        email: res.data.email || "",
        mobile: res.data.mobile || "",
        place: res.data.place || "",
        pincode: res.data.pincode || "",
        gender: res.data.gender || "",
        dob: res.data.dob || "",
        photo: null,
        existingPhoto: res.data.photo || ""
      });
      if (res.data.photo) {
        setPreviewImage(`${apiUrl}${res.data.photo}`);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'photo' && files[0]) {
      const file = files[0];
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setErrors(prev => ({ ...prev, photo: "Only JPG, JPEG, and PNG files are allowed" }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: "Photo size should be less than 5MB" }));
        return;
      }
      setFormData({ ...formData, photo: file });
      setPreviewImage(URL.createObjectURL(file));
      if (errors.photo) {
        setErrors(prev => ({ ...prev, photo: '' }));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    } else if (formData.name.length > 50) {
      newErrors.name = "Name must be less than 50 characters";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = "Name should contain only letters and spaces";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Mobile validation
    const mobileRegex = /^[0-9]{10}$/;
    if (formData.mobile && !mobileRegex.test(formData.mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }

    // Pincode validation
    if (formData.pincode && !/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = "Please select your gender";
    }

    // DOB validation
    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 0) {
        newErrors.dob = "Please enter a valid date of birth";
      } else if (age > 120) {
        newErrors.dob = "Please enter a valid date of birth";
      } else if (age < 18) {
        newErrors.dob = "You must be at least 18 years old";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key === 'photo' && !formData.photo) return;
        if (key === 'existingPhoto') return;
        if (formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });
      formDataToSend.append('lid', lid);

      const res = await axios.post(`${apiUrl}updateuserprofile`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.status === "ok") {
        alert("Profile updated successfully!");
        navigate('/userhome/userprf');
      } else {
        alert(res.data.message || "Error updating profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <div className="edit-profile-header">
          <div className="header-icon">
            <i className="fas fa-user-edit"></i>
          </div>
          <h2>Edit Profile</h2>
          <p>Update your personal information</p>
        </div>

        <form onSubmit={onSubmit} className="edit-profile-form">
          {/* Photo Upload Section */}
          <div className="photo-upload-section">
            <div className="photo-preview" onClick={() => document.getElementById('photoInput').click()}>
              {previewImage ? (
                <img src={previewImage} alt="Preview" />
              ) : (
                <div className="photo-placeholder">
                  <i className="fas fa-camera"></i>
                  <span>Upload Photo</span>
                </div>
              )}
            </div>
            <input
              id="photoInput"
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              style={{ display: 'none' }}
            />
            {errors.photo && <span className="error-message">{errors.photo}</span>}
            <p className="photo-hint">Click to change profile photo (optional)</p>
          </div>

          <div className="form-grid">
            {/* Name Field */}
            <div className="form-group">
              <label>
                <i className="fas fa-user"></i>
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label>
                <i className="fas fa-envelope"></i>
                Email Address <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            {/* Mobile Field */}
            <div className="form-group">
              <label>
                <i className="fas fa-phone"></i>
                Phone Number
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                maxLength="10"
                className={errors.mobile ? 'error' : ''}
              />
              {errors.mobile && <span className="error-message">{errors.mobile}</span>}
            </div>

            {/* Gender Field */}
            <div className="form-group">
              <label>
                <i className="fas fa-venus-mars"></i>
                Gender <span className="required">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={errors.gender ? 'error' : ''}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <span className="error-message">{errors.gender}</span>}
            </div>

            {/* DOB Field */}
            <div className="form-group">
              <label>
                <i className="fas fa-calendar"></i>
                Date of Birth <span className="required">*</span>
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                className={errors.dob ? 'error' : ''}
              />
              {errors.dob && <span className="error-message">{errors.dob}</span>}
            </div>

            {/* Place/City Field */}
            <div className="form-group">
              <label>
                <i className="fas fa-map-marker-alt"></i>
                City / Location
              </label>
              <input
                type="text"
                name="place"
                value={formData.place}
                onChange={handleChange}
                placeholder="Enter your city"
              />
            </div>

            {/* Pincode Field */}
            <div className="form-group">
              <label>
                <i className="fas fa-mail-bulk"></i>
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="6-digit pincode"
                maxLength="6"
                className={errors.pincode ? 'error' : ''}
              />
              {errors.pincode && <span className="error-message">{errors.pincode}</span>}
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate('/userhome/userprf')}>
              <i className="fas fa-times"></i>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Updating...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  Update Profile
                </>
              )}
            </button>
          </div>
        </form>

        {/* Tips Section */}
        <div className="edit-profile-tips">
          <h4>
            <i className="fas fa-shield-alt"></i>
            Privacy Note
          </h4>
          <p>Your information is secure and will only be used for healthcare purposes.</p>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;