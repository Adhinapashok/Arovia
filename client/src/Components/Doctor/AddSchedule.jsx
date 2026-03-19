import React, { useState } from 'react'
import "./Schedule.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function AddSchedule() {
 const[date,setDate]=useState('')
   const[fromtime,setFromTime]=useState('')
   const[totime,setToTime]=useState('')


    const nav=useNavigate()
   const apiUrl = import.meta.env.VITE_API_URL;
   const lid=sessionStorage.getItem("lid")
  const onsubmit=async(e)=>{
    e.preventDefault()
    const res=await axios.post(`${apiUrl}addschedule`,{date,fromtime,totime,lid})
    if(res.data.status=="ok"){
      alert(res.data.message)
      nav('/drhome')
    }
    
  }
  return (
   <div className='addschbody'>
      <div className='addschbox'>
        <h2 className='addschheading'>Schedule</h2>
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
            Submit
          </button>

        </form>
      </div>
   </div>
  )
}

export default AddSchedule