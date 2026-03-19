import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import bg from '../assets/bg.jpg'

const Login = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}login`, { username, password });
      console.log(res.data.data);
      if (res.data.status === 'ok') {
        sessionStorage.setItem('lid', res.data.data._id);
        // Role-based navigation
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

  return (
    <div className="login-container">
      {/* LEFT: Glassmorphism form */}
      <div className="form-panel">
        <div className="glass-card">
          <h1 className="form-title">Welcome back</h1>
          <p className="form-subtitle">Log in to your account</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <div className="input-icon-wrapper">
                <span className="input-icon">👤</span>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-icon-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a href="/forgot-password" className="forgot-link">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="btn-login gradient-btn">
              Log in
            </button>

            <button type="button" onClick={goToSignup} className="btn-secondary">
              Create account
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT: Fantasy bird artwork with glass rings */}
      <div className="art-panel">
        <div className="art-content">
          <div className="bird-container">
            <img
              src={bg}
              alt="Fantasy bird with green feathers"
              className="bird-image"
            />
            {/* Glass rings overlay (purely decorative) */}
            {/* <div className="glass-ring ring-1"></div> */}
            {/* <div className="glass-ring ring-2"></div>
            <div className="glass-ring ring-3"></div> */}
          </div>
          <div className="leaf-decoration"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;