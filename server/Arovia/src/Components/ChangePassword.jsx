// ChangePassword.js
import React, { useState } from "react";
import "./ChangePassword.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ChangePassword({ role }) {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const nav = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Calculate password strength for new password
    if (name === "newPassword") {
      calculatePasswordStrength(value);
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Contains number
    if (/\d/.test(password)) strength += 25;
    
    // Contains lowercase and uppercase
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    
    // Contains special character
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25;
    
    setPasswordStrength(strength);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Old Password validation
    if (!formData.oldPassword) {
      newErrors.oldPassword = "Old password is required";
    }

    // New Password validation
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const lid = sessionStorage.getItem("lid");
      const res = await axios.post(`${apiUrl}chngpass`, {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        lid
      });

      if (res.data.status === "ok") {
        alert(`${role} Password Updated Successfully!`);
        
        // Clear form
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        setPasswordStrength(0);
        
        // Navigate based on role
        if (role === 'Admin') {
          nav('/home');
        } else if (role === 'Doctor') {
          nav('/drhome');
        } else {
          nav('/userhome');
        }
      } else {
        alert(res.data.message || 'Error updating password');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get strength color and label
  const getStrengthInfo = () => {
    if (passwordStrength <= 25) return { color: '#ef4444', label: 'Weak' };
    if (passwordStrength <= 50) return { color: '#f59e0b', label: 'Fair' };
    if (passwordStrength <= 75) return { color: '#3b82f6', label: 'Good' };
    return { color: '#10b981', label: 'Strong' };
  };

  const strengthInfo = getStrengthInfo();

  return (
    <div className="change-password-container">
      {/* Animated Background Circles */}
      <div className="animated-bg">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="change-password-card">
        <div className="password-header">
          <div className="header-icon">
            <i className="fas fa-lock"></i>
          </div>
          <h2>{role} Change Password</h2>
          <p>Please enter your current password and choose a new one</p>
        </div>

        <form onSubmit={handleSubmit} className="password-form">
          {/* Old Password */}
          <div className="form-group">
            <label>
              <i className="fas fa-key"></i>
              Current Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.old ? "text" : "password"}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder="Enter your current password"
                className={errors.oldPassword ? 'error' : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('old')}
              >
                <i className={`fas fa-${showPasswords.old ? 'eye-slash' : 'eye'}`}></i>
              </button>
            </div>
            {errors.oldPassword && (
              <span className="error-message">{errors.oldPassword}</span>
            )}
          </div>

          {/* New Password */}
          <div className="form-group">
            <label>
              <i className="fas fa-lock"></i>
              New Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter your new password"
                className={errors.newPassword ? 'error' : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('new')}
              >
                <i className={`fas fa-${showPasswords.new ? 'eye-slash' : 'eye'}`}></i>
              </button>
            </div>
            
            {/* Password Strength Meter */}
            {formData.newPassword && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div 
                    className="strength-fill"
                    style={{ 
                      width: `${passwordStrength}%`,
                      backgroundColor: strengthInfo.color
                    }}
                  ></div>
                </div>
                <span className="strength-label" style={{ color: strengthInfo.color }}>
                  {strengthInfo.label}
                </span>
              </div>
            )}
            
            {errors.newPassword && (
              <span className="error-message">{errors.newPassword}</span>
            )}
            
            <ul className="password-requirements">
              <li className={formData.newPassword.length >= 8 ? 'valid' : ''}>
                <i className={`fas fa-${formData.newPassword.length >= 8 ? 'check-circle' : 'circle'}`}></i>
                At least 8 characters
              </li>
              <li className={/(?=.*[a-z])/.test(formData.newPassword) ? 'valid' : ''}>
                <i className={`fas fa-${/(?=.*[a-z])/.test(formData.newPassword) ? 'check-circle' : 'circle'}`}></i>
                One lowercase letter
              </li>
              <li className={/(?=.*[A-Z])/.test(formData.newPassword) ? 'valid' : ''}>
                <i className={`fas fa-${/(?=.*[A-Z])/.test(formData.newPassword) ? 'check-circle' : 'circle'}`}></i>
                One uppercase letter
              </li>
              <li className={/(?=.*\d)/.test(formData.newPassword) ? 'valid' : ''}>
                <i className={`fas fa-${/(?=.*\d)/.test(formData.newPassword) ? 'check-circle' : 'circle'}`}></i>
                One number
              </li>
            </ul>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>
              <i className="fas fa-check-circle"></i>
              Confirm Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your new password"
                className={errors.confirmPassword ? 'error' : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                <i className={`fas fa-${showPasswords.confirm ? 'eye-slash' : 'eye'}`}></i>
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
            
            {/* Password Match Indicator */}
            {formData.newPassword && formData.confirmPassword && (
              <div className="password-match">
                {formData.newPassword === formData.confirmPassword ? (
                  <span className="match-success">
                    <i className="fas fa-check-circle"></i>
                    Passwords match
                  </span>
                ) : (
                  <span className="match-error">
                    <i className="fas fa-exclamation-circle"></i>
                    Passwords do not match
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => {
                if (role === 'Admin') nav('/home');
                else if (role === 'Doctor') nav('/drhome');
                else nav('/userhome');
              }}
            >
              <i className="fas fa-times"></i>
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Updating...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security Tips */}
        <div className="security-tips">
          <h4>
            <i className="fas fa-shield-alt"></i>
            Password Security Tips
          </h4>
          <ul>
            <li>
              <i className="fas fa-check-circle"></i>
              Use a mix of letters, numbers, and symbols
            </li>
            <li>
              <i className="fas fa-check-circle"></i>
              Avoid using personal information
            </li>
            <li>
              <i className="fas fa-check-circle"></i>
              Don't reuse passwords from other sites
            </li>
            <li>
              <i className="fas fa-check-circle"></i>
              Change your password regularly
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;