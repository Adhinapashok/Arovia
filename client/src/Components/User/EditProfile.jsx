import React from 'react';
import './SignUp.css'; 

function EditProfile() {
  return (
    <div className="signup-body">
      <div className="signup-box">
        <h2>Edit-Profile</h2>

        <form>
          <div className="form-group">
            <label className="signup-label" htmlFor="username">Username</label>
            <input
              id="username"
              className="signup-input"
              type="text"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label className="signup-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="signup-input"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label className="signup-label" htmlFor="phone">Phone</label>
            <input
              id="phone"
              className="signup-input"
              type="tel"
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label className="signup-label" htmlFor="place">Place / City</label>
            <input
              id="place"
              className="signup-input"
              type="text"
              placeholder="Enter your city or place"
            />
          </div>

          <div className="form-group">
            <label className="signup-label" htmlFor="photo">Profile Photo</label>
            <input
              id="photo"
              className="signup-input file-input"
              type="file"
              accept="image/*"
            />
          </div>

          <div className="form-group">
            <label className="signup-label" htmlFor="pincode">Pincode</label>
            <input
              id="pincode"
              className="signup-input"
              type="text"
              placeholder="Enter your pincode"
              maxLength={10}
            />
          </div>

          <button type="submit" className="signup-btn">
           Update Profile
          </button>
        </form>

      </div>
    </div>
  );
}

export default EditProfile;