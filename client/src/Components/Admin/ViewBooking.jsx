import React, { useEffect, useState } from 'react'
import './ViewBooking.css'
import axios from 'axios';
function ViewBooking() {
   const [data,setData]=useState([])
 const apiUrl = import.meta.env.VITE_API_URL;
  const fetchdata=async()=>{
    const res=await axios.get(`${apiUrl}adminviewbooking`)
    console.log(res.data)
    setData(res.data)
  }
  useEffect(()=>{
    fetchdata();
  },[])
  return (
     <div className="viewdrtable">
      <h2 className="title">VIEW BOOKING</h2>

      <table>
        <thead>
          <tr>
            <th>Sl.no</th>
            <th>Patient Name</th>
            <th>Doctor Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Prescription</th>
          </tr>
        </thead>

        <tbody>
           {data.map((i,index)=>(
          <tr>
            <td>{index+1}</td>
            <td>{i.user.patientname}</td>
            <td>{i.schedule.doctor}</td>
            <td>{i.date}</td>
            <td>{i.time}</td>
            <td>{i.status}</td>
            <td><a></a></td>
           
          </tr>
           ))}
        </tbody>
      </table>
    </div>
  )
}

export default ViewBooking
