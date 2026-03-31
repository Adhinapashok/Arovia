// ForgotPassword.jsx - Simplified with only email verification
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './ForgotPassword.css';
import bg from '../assets/bg.jpg';

const ForgotPassword = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  // Validate email
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setErrors({ email: "Email is required" });
      return false;
    } else if (!emailRegex.test(email)) {
      setErrors({ email: "Please enter a valid email address" });
      return false;
    }
    return true;
  };

  // Handle send reset link
  const handleSendResetLink = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}forgotpassword`, { email });
      if (res.data.status === 'ok') {
        setSuccess('Password reset link has been sent to your email!');
        setErrors({});
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setErrors({ email: res.data.message || 'Email not found' });
      }
    } catch (error) {
      console.error('Error sending reset link:', error);
      setErrors({ email: 'Failed to send reset link. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      {/* Background Image */}
      <div className="forgot-bg-image"></div>
      <div className="bg-overlay"></div>

      {/* Main Card */}
      <div className="forgot-card glass-effect">
        {/* Centered Brand Header */}
        <div className="brand-header-centered">
          <div className="brand-logo-centered">
            <i className="fas fa-heartbeat"></i>
          </div>
          <h1 className="brand-name-centered">AROVIA</h1>
          <p className="brand-tagline-centered">Healthcare Excellence</p>
        </div>

        <h2 className="form-title">Forgot Password?</h2>
        <p className="form-subtitle">Enter your email to receive a password reset link</p>

        <form onSubmit={handleSendResetLink}>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-icon-wrapper">
              <span className="input-icon">
                <i className="fas fa-envelope"></i>
              </span>
              <input
                id="email"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? 'error' : ''}
                disabled={loading}
              />
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {success && <div className="success-message">{success}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Sending...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i>
                Send Reset Link
              </>
            )}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="back-to-login">
          <Link to="/">
            <i className="fas fa-arrow-left"></i>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;