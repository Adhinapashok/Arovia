import axios from 'axios'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
function EditStaff() {
  const location=useLocation()
  const user = location.state

  const[name,setStaff]=useState(user.name)
    const[email,setEmail]=useState(user.email)
    const[phoneno,setMobile]=useState(user.phoneno)
     const[gender,SetGender]=useState(user.gender)
    const[dob,setDOB]=useState(user.dob)
    const[qualification,setQualification]=useState(user.qualification)
    const[role,setRole]=useState(user.role)
    const[experience,setExperience]=useState(user.experience)
    const[photo,setPhoto]=useState(user.photo)
    const [id,setid]=useState(user._id)
    
 const nav=useNavigate()
    const apiUrl = import.meta.env.VITE_API_URL;
   const onsubmit=async(e)=>{
    e.preventDefault()
    const res=await axios.post(`${apiUrl}editstaff`,{name,email,phoneno,gender,dob,qualification,role,experience,id,photo},{headers:{"Content-Type":"multipart/form-data"}})
    if(res.data.status=="ok"){
      alert(res.data.message)
      nav('/viewstf')
    }
    
   }

    
  return (
    <div style={{marginLeft:'600px'}}>
      <div className='adddrbox'>
        <form onSubmit={onsubmit}>
          <label className='adddrlabel'> Staff Name</label>
         <br></br>
          <input className='adddrinput' type='text' value={name} onChange={(e)=>setStaff(e.target.value)} placeholder='Enter Your Name'/><br></br>
          <label className='adddrlabel'>Email</label>
          <br></br>
          <input className='adddrinput' type='email' value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Enter Your Email'/><br></br>
          <label className='adddrlabel'>Mobile.No</label>
          <br></br>
          <input className='adddrinput' type='text' value={phoneno} onChange={(e)=>setMobile(e.target.value)} placeholder='Enter Your Mobile.No'/><br></br>
          <label className='adddrlabel'>Gender</label>
          <br></br>
          <select value={gender} onChange={(e)=>SetGender(e.target.value)} className='selectadddr' style={{marginBottom:'15px'}}>
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
          <input className='adddrinput' type='text'  value={qualification} onChange={(e)=>setQualification(e.target.value)} placeholder='Enter Your Role'/><br></br>
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
          <button className='adddrbutton'>Submit</button>
        </form>
      </div>
    </div>
  )
}

export default EditStaff
