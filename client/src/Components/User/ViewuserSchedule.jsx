import React, { useEffect, useState } from 'react'
import './ViewBooking.css'
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function ViewuserSchedule() {
  const location= useLocation()
  const user = location.state
  const nav=useNavigate()
   const [data,setData]=useState([])
 const apiUrl = import.meta.env.VITE_API_URL;
 const lid=sessionStorage.getItem("lid")
  const fetchdata=async()=>{
    const res=await axios.get(`${apiUrl}doctorviewschedule/${user.login}`)
    console.log(res.data)
    setData(res.data)
  }
  useEffect(()=>{
    fetchdata();
  },[])
const bookschedule=async(id)=>{
    const res=await axios.post(`${apiUrl}userbookschedule`,{id,lid})
    if(res.data.status=="ok"){
      alert(res.data.message)
      nav('/userhome')
    }
  }


  return (
     <div className="viewdrtable">
      <h2 className="title" style={{textAlign:'center'}}>VIEW SCHEDULE</h2>

      <table>
        <thead>
          <tr>
            <th>Sl.no</th>
            <th>Date</th>
            <th>FromTime</th>
            <th>ToTime</th>
            <th>Book</th>
          </tr>
        </thead>

        <tbody>
           {data.map((i,index)=>(
          <tr>
            <td>{index+1}</td>
            <td>{i.date}</td>
            <td>{i.fromtime}</td>
            <td>{i.totime}</td>
            <td><button onClick={()=>bookschedule(i._id)}>Book</button></td>
          </tr>
           ))}
        </tbody>
      </table>
    </div>
  )
}

export default ViewuserSchedule
