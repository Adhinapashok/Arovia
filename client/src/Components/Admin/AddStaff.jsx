import React, { useState } from 'react'
import './Admin.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
function AddStaff() {

  const[staff,setStaff]=useState('')
  const[email,setEmail]=useState('')
  const[mobile,setMobile]=useState('')
  const[gender,setGender]=useState('')
  const[dob,setDOB]=useState('')
  const[qualification,setQualification]=useState('')
  const[role,setRole]=useState('')
  const[experience,setExperience]=useState('')
  const[photo,setPhoto]=useState('')
   const nav=useNavigate()
    const apiUrl = import.meta.env.VITE_API_URL;
   const onsubmit=async(e)=>{
    e.preventDefault()
    const res=await axios.post(`${apiUrl}addstaff`,{staff,email,mobile,gender,dob,qualification,role,experience,photo},{headers:{"Content-Type":"multipart/form-data"}})
    if(res.data.status=="ok"){
      alert(res.data.message)
      nav('/home')
    }
    
   }
   
  
  return (
    <div>
      <div className='adddrbox' style={{marginLeft:'38%'}}>
        <form onSubmit={onsubmit}>
          <label className='adddrlabel'>Staff Name</label>
         <br></br>
          <input className='adddrinput' type='text' value={staff} onChange={(e)=>setStaff(e.target.value)}  placeholder='Enter Your Name'/><br></br>
          <label className='adddrlabel'>Email</label>
          <br></br>
          <input className='adddrinput' type='email' value={email} onChange={(e)=>setEmail(e.target.value)}  placeholder='Enter Your Email'/><br></br>
          <label className='adddrlabel'>Mobile.No</label>
          <br></br>
          <input className='adddrinput' type='text' value={mobile} onChange={(e)=>setMobile(e.target.value)}  placeholder='Enter Your Mobile.No'/><br></br>
          <label className='adddrlabel'>Gender</label>
          <br></br>
          <select value={gender} className='selectadddr' onChange={(e)=>setGender(e.target.value)}  style={{marginBottom:'15px'}}>
             <option disabled selected value="">Choose your gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>others</option>
          </select>
         <br></br>
          <label  className='adddrlabel'>DOB</label>
          <br></br>
          <input className='adddrinput' type='date' value={dob} onChange={(e)=>setDOB(e.target.value)} placeholder='Enter Your DOB'/>
          <br></br>
          <label className='adddrlabel'>Qualification</label>
          <br></br>
          <input className='adddrinput' type='text' value={qualification} onChange={(e)=>setQualification(e.target.value)}  placeholder='Enter Your Qualification'/><br></br>
          <label className='adddrlabel'>Role</label>
          <br></br>
          <input className='adddrinput' type='text' value={role} onChange={(e)=>setRole(e.target.value)}  placeholder='Enter Your Role'/>
          <br></br>
          <label className='adddrlabel'>Experience</label>
          <br></br>
          <input className='adddrinput' type='text' value={experience} onChange={(e)=>setExperience(e.target.value)} placeholder='Enter Your Experience'/>
          <br></br>
          <label className='adddrlabel'>Photo</label>
          <br></br>
          <input className='adddrinput' type='file' onChange={(e)=>setPhoto(e.target.files[0])}/>
          <br></br>
          
          <button className='adddrbutton'>Register</button>
        </form>
      </div>

    </div>
  )
}

export default AddStaff
