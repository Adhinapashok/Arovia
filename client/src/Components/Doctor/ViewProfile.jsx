import React, { useEffect, useState } from 'react'
import './ViewProfile.css'
import axios from 'axios';

function ViewProfile() {
    const [name,setname]=useState("")
    const [email,setemail]=useState("")
    const [mobile,setmobile]=useState("")
    const [gender,setgender]=useState("")
    const [dob,setdob]=useState("")
    const [qualification,setqualification]=useState("")
    const [specialization,setspecialization]=useState("")
    const [experience,setexperience]=useState("")
    const [photo,setphoto]=useState("")

 const apiUrl = import.meta.env.VITE_API_URL;
 const lid=sessionStorage.getItem("lid")
  const fetchdata=async()=>{
    const res=await axios.get(`${apiUrl}drprofile/${lid}`)
    console.log(res.data)
    setname(res.data.name)
    setemail(res.data.email)
    setmobile(res.data.mobile)
    setgender(res.data.gender)
    setdob(res.data.dob)
    setqualification(res.data.qualification)
    setspecialization(res.data.specialization)
    setexperience(res.data.experience)
    setphoto(res.data.photo)
  }
  useEffect(()=>{
    fetchdata();
  },[])
  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Doctor Profile</h2>

        <div className="profile-content">
          
          <div className="profile-image">
            <img 
              src={apiUrl+photo} 
              alt="Doctor"
             />
          </div>

          <div className="profile-details">
            <p><strong>Name:</strong> {name}</p>                    
            <p><strong>Email:</strong> {email}</p>
            <p><strong>phone:</strong> {mobile}</p>
            <p><strong>Gender:</strong> {gender}</p>
            <p><strong>DOB:</strong> {dob}</p>
            <p><strong>Qualification:</strong> {qualification}</p>
            <p><strong>Specialization:</strong> {specialization}</p>
            <p><strong>Experience:</strong>  {experience}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewProfile



