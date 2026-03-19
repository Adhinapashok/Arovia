import React, { useEffect, useState } from "react";
import "./Schedule.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
function ViewdrSchedule() {

   const [data,setData]=useState([])
 const apiUrl = import.meta.env.VITE_API_URL;
 const lid=sessionStorage.getItem("lid")
  const fetchdata=async()=>{
    const res=await axios.get(`${apiUrl}doctorviewschedule/${lid}`)
    console.log(res.data)
    setData(res.data)
  }
  useEffect(()=>{
    fetchdata();
  },[])
  const deletedata=async(id)=>{
    await axios.get(`${apiUrl}deletesche/${id}`)
    fetchdata()
  }

  return (
    <div className="schedule-container">
      <h2 className="schedule-title">View Schedule</h2>

      <div className="schedule-table-box">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Sl.No</th>
              <th>Date</th>
              <th>From time</th>
              <th>To time</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
           {data.map((i,index)=>(
            <tr>
              <td>{index+1}</td>
              <td>{i.date}</td>
              <td>{i.fromtime}</td>
              <td>{i.totime}</td>
             <td><Link to={"/editsche"} state={i}>Edit</Link></td>
            <td><button onClick={()=>deletedata(i._id)}>delete</button></td>
            </tr>
           ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewdrSchedule;
