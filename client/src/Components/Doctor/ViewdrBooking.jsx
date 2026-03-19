import React, { useEffect, useState } from 'react'
import './Booking.css'
import axios from 'axios';
import { Link } from 'react-router-dom';
function ViewdrBooking() {

    const [data,setData]=useState([])
 const apiUrl = import.meta.env.VITE_API_URL;
 const lid=sessionStorage.getItem("lid")
  const fetchdata=async()=>{
    const res=await axios.get(`${apiUrl}drviewbooking/${lid}`)
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
            <th>Date</th>
            <th>Time</th>
            <th>From Time</th>
            <th>To Time</th>
            <th>Schedule date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((i,index)=>(
          <tr>
            <td>{index+1}</td>
            <td>{i.user.name}</td>
            <td>{i.date}</td>
            <td>{i.time}</td>
            <td>{i.schedule.fromtime}</td>
            <td>{i.schedule.totime}</td>
            <td>{i.schedule.date}</td>
            <td>{i.status}</td>
            <td><Link to={"/addpres"} state={i}>Prescription</Link></td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ViewdrBooking
