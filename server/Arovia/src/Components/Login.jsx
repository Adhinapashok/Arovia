// Login.jsx - Updated with centered logo and name
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import bg from '../assets/bg.jpg'

const Login = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}login`, { username, password });
      console.log(res.data.data);
      if (res.data.status === 'ok') {
        sessionStorage.setItem('lid', res.data.data._id);
        if (res.data.data.Role === 'admin') {
          nav('/home');
        } else if (res.data.data.Role === 'doctor') {
          nav('/drhome');
        } else if (res.data.data.Role === 'user') {
          nav('/userhome');
        } else {
          alert(res.data.message);
        }
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  const goToSignup = () => {
    nav('/signup');
  };

  const goToForgotPassword = () => {
    nav('/ForgotPassword');
  };
  

  return (
    <div className="login-container">
      {/* LEFT: Glassmorphism form */}
      <div className="form-panel">
        <div className="glass-card">
          {/* Centered AROVIA Logo and Branding */}
          <div className="brand-header-centered">
            <div className="brand-logo-centered">
              <i className="fas fa-heartbeat"></i>
            </div>
            <h1 className="brand-name-centered">AROVIA</h1>
            <p className="brand-tagline-centered">Healthcare Excellence</p>
          </div>
          
          <h2 className="form-title">Welcome back</h2>
          <p className="form-subtitle">Log in to your account</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username"> Email</label>
              <div className="input-icon-wrapper">
                <span className="input-icon">
                  <i className="fas fa-envelope"></i>
                </span>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-icon-wrapper">
                <span className="input-icon">
                  <i className="fas fa-lock"></i>
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="row-options">
              
              <Link to={"/ForgotPassword"} className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="btn-login gradient-btn">
              <i className="fas fa-sign-in-alt"></i>
              Log in
            </button>

            <div className="divider">
              <span>or</span>
            </div>

            <button type="button" onClick={goToSignup} className="btn-secondary">
              <i className="fas fa-user-plus"></i>
              Create new account
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT: Full Cover Image */}
      <div className="image-panel">
        <div className="image-overlay"></div>
        <div className="image-content">
          <img
            src={bg}
            alt="Healthcare"
            className="cover-image"
          />
          <div className="image-text">
            <h3>Your Health, Our Priority</h3>
            <p>Access quality healthcare services anytime, anywhere</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;