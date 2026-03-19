import React, { useEffect, useState } from "react";
import "../Doctor/Prescription.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
function ViewPrescription() {
const location=useLocation()
  const user = location.state

  const[name,setname]=useState(user.user.name)
  const[place,setplace]=useState(user.user.place)
  const[date,setdate]=useState(user.date)
  const[dob,setdob]=useState(user.user.dob)
  const[age,setage]=useState('')
  const[gender,setgender]=useState(user.user.gender)
  const[Diagnosis,setdiagnosis]=useState('')
  const[Prescription,setprescription]=useState('')
  const[drname,setdrname]=useState(user.schedule.doctor.name)
  const[phone,setphone]=useState(user.schedule.doctor.mobile)
  const[specialization,setspecialization]=useState(user.schedule.doctor.specialization)
  function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

  const nav=useNavigate()
   const apiUrl = import.meta.env.VITE_API_URL;
   const onsubmit=async(e)=>{
    e.preventDefault()
   
    
  }
 const bid=user._id
  const fetchdata=async()=>{
    const res=await axios.get(`${apiUrl}usviewpresc/${bid}`)
    console.log(res.data)
    setprescription(res.data.Prescription)
    setdiagnosis(res.data.Diagnosis)
   
  }
  useEffect(() => {
  setage(calculateAge(dob));
  fetchdata()
}, [dob]);

  return (
    <div className="prescription-wrapper">

      <div className="prescription-card">

        {/* Header */}
        <div className="top-header">
          <div>
            <h3>{drname}</h3>
            <p></p>
            <p className="speciality">{specialization}</p>
            <span>phone No: {phone}</span>
          </div>
          <div className="plus">+</div>
        </div>

        {/* Title */}
        <div className="center-heading">
          <h1>MEDICAL CENTER</h1>
          <p>COMPANY NAME</p>
          <h2>MEDICAL PRESCRIPTION FORM</h2>
        </div>

        {/* Form */}
        <form onSubmit={onsubmit}>

          <div className="row">
            <div className="field">
              <label>Patient Name</label>
              <input type="text"  name="patientName" value={name} readOnly/>
            </div>

            <div className="field">
              <label>Place</label>
              <input type="text" name="place" value={place} readOnly/>
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>Date of Birth</label>
              <input type="date" name="dob" value={dob} readOnly/>
            </div>

            <div className="field">
              <label>Date</label>
              <input type="date" name="date" value={date} readOnly/>
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>Age</label>
              <input type="text" name="age" value={age} readOnly/>
            </div>

            <div className="field">
              <label>Gender</label>
              <input type="text" name="gender" value={gender} readOnly/>
            </div>
          </div>

          <div className="field full">
            <label>Diagnosis</label>
            <input type="text" value={Diagnosis} readOnly  name="diagnosis" />
          </div>

          <div className="rx-section">
            <h2>Rx:</h2>
            <textarea name="prescription" value={Prescription} readOnly></textarea>
          </div>


        </form>

        {/* Footer */}
        <div className="footer">
          <p>Phone: +01 2345 6789 | Email: clinic@email.com | www.yourwebsite.com</p>
          <p>Address: Lorem Ipsum Street, Dolor, Sit Amet 12345</p>
        </div>

      </div>

    </div>
  );
}

export default ViewPrescription;