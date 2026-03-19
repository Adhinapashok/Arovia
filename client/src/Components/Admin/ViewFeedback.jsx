import React, { useEffect, useState } from 'react'
import './ViewBooking.css'
import axios from 'axios'
function ViewFeedback() {
  const [data,setData]=useState([])
 const apiUrl = import.meta.env.VITE_API_URL;
  const fetchdata=async()=>{
    const res=await axios.get(`${apiUrl}adminviewfeedback`)
    console.log(res.data)
    setData(res.data)
  }
  useEffect(()=>{
    fetchdata();
  },[])

  return (
     <div className="viewdrtable">
      <h2 className="title"> FEEDBACK</h2>

      <table>
        <thead>
          <tr>
            <th>Sl.no</th>
            <th>Date</th>
            <th>Review</th>
            <th>Rating</th>
          </tr>
        </thead>

        <tbody>
          {data.map((i,index)=>(
          <tr>
            <td>{index+1}</td>
            <td>{i.date}</td>
            <td>{i.review}</td>
            <td>{i.rating}</td>
          </tr>
           ))}
        </tbody>
      </table>
    </div>
  )
}

export default ViewFeedback