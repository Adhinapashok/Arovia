import React, { useEffect, useState } from "react";
import "./ViewSchedule.css";
import axios from "axios";


function ViewSchedule() {
   const [data,setData]=useState([])
 const apiUrl = import.meta.env.VITE_API_URL;
  const fetchdata=async()=>{
    const res=await axios.get(`${apiUrl}adminviewschedule`)
    console.log(res.data)
    setData(res.data)
  }
  useEffect(()=>{
    fetchdata();
  },[])

  return (
    <div className="schedule-container">
      <h2 className="schedule-title">Admin - View Schedule</h2>

      <div className="schedule-table-box">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Sl.No</th>
              <th>Doctor Name</th>
              <th>Specialization</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Patient Name</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((i,index)=>(
            <tr>
              <td>{index+1}</td>
              <td>{i.doctorname}</td>
              <td>{i.specilaization}</td>
              <td>{i.date}</td>
              <td>{i.timeslot}</td>
              <td>{i.status}</td>
              <td>
                {/* <a href="" className="status booked">Booked</a> */}
                </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewSchedule;
