import React from "react";
import "./UserHome.css";

function UserHome() {
  return (
    <div className="userhome-container">

      <nav className="userhome-navbar">
        <div className="userhome-logo">Hospital System</div>

        <ul className="userhome-menu">
          <li><a href="/usviewdr">Doctors</a></li>
          <li><a href="/usviewbook">View Booking</a></li>
        </ul>

        <div className="userhome-dropdown">
          <button className="userhome-dropbtn">Account ▼</button>

          <div className="userhome-dropdown-content">
            <a href="/userprf">Profile</a>
            <a href="/uschgps">Change Password</a>
            <a href="/">Logout</a>
          </div>
        </div>
      </nav>

      <div className="userhome-content">
        <h2>Welcome User</h2>
        <p>Select an option from the menu to continue.</p>
      </div>

    </div>
  );
}

export default UserHome;