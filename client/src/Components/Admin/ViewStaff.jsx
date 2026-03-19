import React, { useEffect, useState } from "react";
import "./ViewDoctor.css";
import axios from "axios";
import { Link } from "react-router-dom";
function ViewStaff() {
    const [data,setData]=useState([])
 const apiUrl = import.meta.env.VITE_API_URL;
  const fetchdata=async()=>{
    const res=await axios.get(`${apiUrl}viewstaff`)
    console.log(res.data)
    setData(res.data)
  }
  useEffect(()=>{
    fetchdata();
  },[])
  const deletedata=async(id)=>{
    await axios.get(`${apiUrl}deletestf/${id}`)
    fetchdata()
  }


  return (
    <div className="viewdrtable">
      <h2 className="title">Staff Details</h2>

      <table>
        <thead>
          <tr>
            <th>Sl.no</th>
            <th> staffName</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Gender</th>
            <th>DOB</th>
            <th>Qualification</th>
            <th>Role</th>
            <th>Experience</th>
            <th>Photo</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
           {data.map((i,index)=>(
          <tr>
            <td>{index+1}</td>
            <td>{i.name}</td>
            <td>{i.email}</td>
            <td>{i.phoneno}</td>
            <td>{i.gender}</td>
            <td>{i.dob}</td>
            <td>{i.qualification}</td>
            <td>{i.role}</td>
            <td>{i.experience}</td>
            <td><img src={`${apiUrl}${i.photo}`} height={50} width={50}></img></td>
            <td><Link to={"/editstf"} state={i}>Edit</Link></td>
            <td><button onClick={()=>deletedata(i._id)}>delete</button></td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewStaff;
