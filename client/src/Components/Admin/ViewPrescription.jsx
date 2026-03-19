import React, { useEffect, useState } from 'react'
import './ViewBooking.css'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom'
function ViewPrescription() {
  const [data,setData]=useState([])
 const apiUrl = import.meta.env.VITE_API_URL;
  const fetchdata=async()=>{
    const res=await axios.get(`${apiUrl}adminviewprescription`)
    console.log(res.data)
    setData(res.data)
  }
  useEffect(()=>{
    fetchdata();
  },[])
  return (
    <div className="viewdrtable">
      <h2 className="title">PRESCRIPTION</h2>

      <table>
        <thead>
          <tr>
            <th>Sl.no</th>
            <th>Date</th>
            <th>Dr.Name</th>
            <th>Patient Name</th>
            <th>Prescription</th>
          </tr>
        </thead>

        <tbody>
          {data.map((i,index)=>(
          <tr>
            <td>{index+1}</td>
            <td>{i.date}</td>
            <td>{i.drname}</td>
            <td>{i.patientname}</td>
            <td>{i.prescription}</td>
            
           </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ViewPrescription
