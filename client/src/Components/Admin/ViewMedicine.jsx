import React, { useEffect, useState } from 'react'
import './ViewMedicine.css'
import axios from 'axios';
import { Link } from 'react-router-dom';
function ViewMedicine() {
   const [data,setData]=useState([])
 const apiUrl = import.meta.env.VITE_API_URL;
  const fetchdata=async()=>{
    const res=await axios.get(`${apiUrl}viewmed`)
    console.log(res.data)
    setData(res.data)
  }
  useEffect(()=>{
    fetchdata();
  },[])

  const deletedata=async(id)=>{
    await axios.get(`${apiUrl}deletemed/${id}`)
    fetchdata()
  }

  return (
     <div className="viewdrtable">
      <h2 className="title">VIEW MEDICINE</h2>

      <table>
        <thead>
          <tr>
            <th>Sl.no</th>
            <th>Medicine Name</th>
            <th>Brand Name</th>
            <th>Category</th>
            <th>Dosage Strength</th>
            <th>Manufacture</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Expiry Date</th>
            <th>Action</th>
            <th>Update Stock</th>
          </tr>
        </thead>

        <tbody>
         {data.map((i,index)=>(
          <tr>
            <td>{index+1}</td>
            <td>{i.medname}</td>
            <td>{i.brandname}</td>
            <td>{i.category}</td>
            <td>{i.dosagestrength}</td>
            <td>{i.manufacture}</td>
            <td>{i.price}</td>
            <td>{i.stock[0]?.quantity}</td>
            <td>{i.expirydate}</td>
            <td>
              <Link to={"/editmed"} state={i}>Edit</Link>
              <button onClick={()=>deletedata(i._id)}>Delete</button>
              </td>
           
            <td><Link to={"/addstk"} state={i}>Stock</Link></td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ViewMedicine
