import React, { useState } from 'react'
import "./Schedule.css";
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function EditSchedule() {
  const location=useLocation()
    const user = location.state
 const[date,setDate]=useState(user.date)
    const[fromtime,setFromTime]=useState(user.fromtime)
    const[totime,setToTime]=useState(user.totime)

  const nav=useNavigate()
   const apiUrl = import.meta.env.VITE_API_URL;
   const onsubmit=async(e)=>{
    e.preventDefault()
    const res=await axios.post(`${apiUrl}editsche`,{date,fromtime,totime,id:user._id})
    if(res.data.status=="ok"){
      alert(res.data.message)
      nav('/viewdrsche')
    }
    
  }
  return (
   <div className='addschbody'>
      <div className='addschbox'>
        <h2 className='addschheading'> Edit-Schedule</h2>
        <form onSubmit={onsubmit}>

          <label className='addschlabel'>Date</label>
          <input className='addschinput' type='date' 
          value={date} onChange={(e)=>setDate(e.target.value)}
          />

          <label className='addschlabel'>From Time</label>
          <input 
            className='addschinput' 
            type='time' 
            value={fromtime} onChange={(e)=>setFromTime(e.target.value)}
            step="60"
          />

          <label className='addschlabel'>To Time</label>
          <input 
            className='addschinput' 
            type='time' 
            value={totime} onChange={(e)=>setToTime(e.target.value)}
            step="60"
          />
          <button type="submit" className="addschbtn">
            Update
          </button>

        </form>
      </div>
   </div>
  )
}

export default EditSchedule