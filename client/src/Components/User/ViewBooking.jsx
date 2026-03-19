import React, { useEffect, useState } from 'react'
import './ViewBooking.css'
import axios from 'axios'; 
import { Link } from 'react-router-dom';
function ViewBookings() {

  const [data,setData]=useState([])
 const apiUrl = import.meta.env.VITE_API_URL;
 const lid=sessionStorage.getItem("lid")
  const fetchdata=async()=>{
    const res=await axios.get(`${apiUrl}usviewbooking/${lid}`)
    console.log(res.data)
    setData(res.data)
  }
  useEffect(()=>{
    fetchdata();
  },[])
  return (
     <div className="viewdrtable">
      <h2 className="title" style={{textAlign:'center'}}>VIEW BOOKING</h2>
      <table>
        <thead>
          <tr>
            <th>Sl.no</th>
            <th>Doctor Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Schedule</th>
            <th>Prescription</th>
          </tr>
        </thead>

        <tbody>
          {data.map((i,index)=>(
          <tr>
            <td>{index+1}</td>
            <td>
              {i.schedule.doctor.name}<br></br>
              {i.schedule.doctor.email}<br></br>
              {i.schedule.doctor.mobile}<br></br>
          
            </td>
            <td>{i.date}</td>
            <td>{i.time}</td>
            <td>{i.status}</td>
            <td>
              {i.schedule.date}<br></br>
              {i.schedule.fromtime}<br></br>
              {i.schedule.totime}

            </td>
           <td><Link to={"/usviewpres"} state={i}>Prescription</Link></td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ViewBookings