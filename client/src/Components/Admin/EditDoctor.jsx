import axios from 'axios'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function EditDoctor() {
const location=useLocation()
const user = location.state
  
const[name,setName]=useState(user.name)
const[email,setEmail]=useState(user.email)
const[mobile,setMobile]=useState(user.mobile)
const[gender,setGender]=useState(user.gender)
const[dob,setDob]=useState(user.dob)
const[qualification,setQualification]=useState(user.qualification)
const[specialization,setSpecialization]=useState(user.specialization)
const[experience,setExperience]=useState(user.experience)
const[photo,setPhoto]=useState(user.photo)

const nav=useNavigate()
const apiUrl = import.meta.env.VITE_API_URL;
  const onsubmit=async(e)=>{
    e.preventDefault()
    const res=await axios.post(`${apiUrl}editdr`,{name,email,mobile,gender,dob,qualification,specialization,experience,id:user._id,photo},{headers:{"Content-Type":"multipart/form-data"}})
    if(res.data.status=="ok"){
      alert(res.data.message)
      nav('/viewdr')
    }
    
  }


  return (



    
    <div className='adddrbody'>
      <div className='adddrbox'>
        <form onSubmit={onsubmit}>
          <label className='adddrlabel'>Name</label>
         <br></br>
          <input className='adddrinput' type='text' value={name} onChange={(e)=>setName(e.target.value)} placeholder='Enter Your Name'/><br></br>
          <label className='adddrlabel'>Email</label>
          <br></br>
          <input className='adddrinput' type='email' value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Enter Your Email'/><br></br>
          <label className='adddrlabel'>Phone</label>
          <br></br>
          <input className='adddrinput' type='text' value={mobile} onChange={(e)=>setMobile(e.target.value)}  placeholder='Enter Your Mobile.No'/><br></br>
          <label className='adddrlabel'>Gender</label>
          <br></br>
          <select className='selectadddr' value={gender} onChange={(e)=>setGender(e.target.value)} style={{marginBottom:'15px'}}>
             <option disabled selected value="">Choose your gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>others</option>
          </select>
         <br></br>
          <label  className='adddrlabel'>DOB</label>
          <br></br>
          <input className='adddrinput' type='date' value={dob} onChange={(e)=>setDob(e.target.value)} placeholder='Enter Your DOB'/>
          <br></br>
          <label className='adddrlabel'>Qualification</label>
          <br></br>
          <input className='adddrinput' type='text'value={qualification}  onChange={(e)=>setQualification(e.target.value)} placeholder='Enter Your Qualification'/><br></br>
          <label className='adddrlabel'>Specialization</label>
          <br></br>
          <input className='adddrinput' type='text'value={specialization} onChange={(e)=>setSpecialization(e.target.value)} placeholder='Enter Your Specialization'/>
          <br></br>
          <label className='adddrlabel'>Experience</label>
          <br></br>
          <input className='adddrinput' type='text' value={experience} onChange={(e)=>setExperience(e.target.value)} placeholder='Enter Your Experience'/>
          <br></br>
          <label className='adddrlabel'>Photo</label>
          <br></br>
          <input className='adddrinput' type='file' onChange={(e)=>setPhoto(e.target.files[0])}/>
          <br></br>
          <button className='adddrbutton'>Update</button>
        </form>
      </div>
      
    </div>
  )
}

export default EditDoctor
