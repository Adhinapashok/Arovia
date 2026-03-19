import React, { useEffect, useState } from 'react'
import '../Doctor/ViewProfile.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function ViewProfile() {

    const [name,setname]=useState("")
    const [email,setemail]=useState("")
    const [mobile,setmobile]=useState("")
    const [gender,setgender]=useState("")
    const [dob,setdob]=useState("")
    const [place,setplace]=useState("")
    const [pincode,setpincode]=useState("")
    const [photo,setphoto]=useState("")

 const apiUrl = import.meta.env.VITE_API_URL;
 const lid=sessionStorage.getItem("lid")
  const fetchdata=async()=>{
    const res=await axios.get(`${apiUrl}userprofile/${lid}`)
    console.log(res.data)
    setname(res.data.name)
    setemail(res.data.email)
    setmobile(res.data.mobile)
    setgender(res.data.gender)
    setdob(res.data.dob)
    setplace(res.data.place)
    setpincode(res.data.pincode)
    setphoto(res.data.photo)
  }
  useEffect(()=>{
    fetchdata();
  },[])

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>User Profile</h2>

        <div className="profile-content">
          
          <div className="profile-image">
            <img 
              src={apiUrl+photo}  
              alt="User"
            />
          </div>

          <div className="profile-details">
            <p><strong>Name:</strong> {name}</p>                    
            <p><strong>Email:</strong> {email}</p>
            <p><strong>phone:</strong> {mobile}</p>
            <p><strong>Gender:</strong> {gender}</p>
            <p><strong>DOB:</strong> {dob}</p>
            <p><strong>PLACE:</strong> {place}</p>
            <p><strong>Pincode:</strong>{pincode}</p>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewProfile



