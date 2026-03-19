import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './DoctorHome.css'
import axios from 'axios'
function DoctorHome() {
   

  return (

    <div className="docdash-container">

      {/* Navbar */}

      <div className="docdash-navbar">

        <h2 className="docdash-logo">Doctor Panel</h2>

        <div className="docdash-links">
          <Link to="/addsche">Add Schedule</Link>
          <Link to="/viewdrsche">View Schedule</Link>
          <Link to="/viewdrbook">View Booking</Link>
          <Link to="/viewdrprof">View Profile</Link>
        </div>

        {/* Dropdown */}

        <div className="docdash-dropdown">

          <button className="docdash-dropbtn">Account ▾</button>

          <div className="docdash-dropdown-content">
            <Link to="/drchngpas">Change Password</Link>
            <Link to="/">Logout</Link>
          </div>

        </div>

      </div>


      {/* Dashboard */}

      <div className="docdash-home">

        <h1 className="docdash-title">Welcome Doctor</h1>

        <div className="docdash-card-container">

          <Link to="/addsche" className="docdash-card">
            Add Schedule
          </Link>

          <Link to="/viewdrsche" className="docdash-card">
            View Schedule
          </Link>

          <Link to="/viewdrbook" className="docdash-card">
            View Booking
          </Link>

          <Link to="/viewdrprof" className="docdash-card">
            View Profile
          </Link>

        </div>

      </div>

    </div>

  )
}

export default DoctorHome