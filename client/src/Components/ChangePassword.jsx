import React, { useEffect, useState } from "react";
import "./ChangePassword.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ChangePassword({ role }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
 const nav=useNavigate()
   const apiUrl = import.meta.env.VITE_API_URL;
  const handleSubmit = async(e) => {
    e.preventDefault();

    // Validation
    if (newPassword !== confirmPassword) {
      alert("New Password and Confirm Password must match!");
      return;
    }
    const lid=sessionStorage.getItem("lid")
     const res=await axios.post(`${apiUrl}chngpass`,{oldPassword,newPassword,lid})
    if(res.data.status=="ok"){
      alert(`${role} Password Updated Successfully!`);
      nav('/')
    }
    else{
      alert(res.data.message)
    }
  
    // Clear fields
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="change-password-container">
      <div className="change-password-box">
        <h2>{role} Change Password</h2>

        <form onSubmit={handleSubmit}>
          {/* Old Password */}
          <div className="input-group">
            <label>Old Password</label>
            <input
              type="password"
              placeholder="Enter old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>

          {/* New Password */}
          <div className="input-group">
            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Button */}
          <button type="submit" className="btn-change">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
