import React, { useEffect, useState } from 'react'
import './ViewBooking.css'
import axios from 'axios';
import { Link } from 'react-router-dom';
function ViewDoctors() {
   const [data,setData]=useState([])
 const apiUrl = import.meta.env.VITE_API_URL;
  const fetchdata=async()=>{
    const res=await axios.get(`${apiUrl}adminviewdoctor`)
    console.log(res.data)
    setData(res.data)
  }
  useEffect(()=>{
    fetchdata();
  },[])

  return (
     <div className="viewdrtable">
      <h2 className="title"  style={{textAlign:'center'}}>VIEW DOCTOR</h2>

      <table>
        <thead>
          <tr>
            <th>Sl.no</th>
            <th>DR Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Qualification</th>
            <th>Specialization</th>
            <th>Experience</th>
            <th>Photo</th>
            <th>Schedule</th>
          </tr>
        </thead>

        <tbody>
          {data.map((i,index)=>(
<tr>
            <td>{index+1}</td>
            <td>{i.name}</td>
            <td>{i.email}</td>
            <td>{i.mobile}</td>
            <td>{i.qualification}</td>
            <td>{i.specialization}</td>
            <td>{i.experience}</td>
            <td><img src={`${apiUrl}${i.photo}`} height={50} width={50}></img></td>
            <td><Link to={"/usviewsch"} state={i}>Schedule</Link></td>
            
          </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ViewDoctors
