import axios from 'axios'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
function EditMedicine() {
 const location= useLocation()
const user = location.state

const[medname,setMedicine]=useState(user.medname)
   const[brandname,setBrand]=useState(user.brandname)
   const[category,setCategory]=useState(user.category)
   const[dosagestrength,SetDosageStrength]=useState(user.dosagestrength)
   const[manufacture,setManufacture]=useState(user.manufacture)
   const[price,setPrice]=useState(user.price)
   const[expirydate,setExpiryDate]=useState(user.expirydate)

const nav=useNavigate()
   const apiUrl = import.meta.env.VITE_API_URL;
   const onsubmit=async(e)=>{
    e.preventDefault()
    const res=await axios.post(`${apiUrl}editmed`,{medname,brandname,category,dosagestrength,manufacture,price,expirydate,id:user._id})
    if(res.data.status=="ok"){
      alert(res.data.message)
      nav('/viewmed')
    }
    
  }

  return (
    
    
    <div>
      <div className='addmedbox'>
    <form onSubmit={onsubmit}>
     <label className='addmedlabel'>Medicine Name</label>
     <br></br>
     <input className='addmedinput' type='text' value={medname} onChange={(e)=>setMedicine(e.target.value)} placeholder='Enter Medicine Name'/><br></br>
    <label className='addmedlabel'>Brand Name</label>
    <br></br>
    <input className='addmedinput' type='text' value={brandname} onChange={(e)=>setBrand(e.target.value)} placeholder='Enter Brand Name '/><br></br>
    <label className='addmedlabel'>Category</label>
    <br></br>
    <select value={category}  onChange={(e)=>setCategory(e.target.value)} className='selectaddmed' /*style={{marginBottom:'15px'}}*/>
            <option>Tablets</option>
            <option>Capsules</option>
            <option>Syrups</option>
            <option>Drops</option>
            <option>Injection</option>
             <option>Ointment</option>
              <option>Inhailer</option>
          </select><br></br>

  <label className='addmedlabel'>Dosage Strength</label>
     <br></br>
     <input className='addmedinput' type='text'  value={dosagestrength} onChange={(e)=>SetDosageStrength(e.target.value)} placeholder='Enter Dosage Strength'/><br></br> 
     <label className='addmedlabel'>Manufacture</label>
     <br></br>
     <input className='addmedinput' type='date' value={manufacture} onChange={(e)=>setManufacture(e.target.value)} placeholder='Enter Manufacture'/><br></br>       
  <label className='addmedlabel'>Price</label>
    <br></br>
    <input className='addmedinput' type='text' value={price} onChange={(e)=>setPrice(e.target.value)} placeholder='Enter Price '/><br></br>
    <label className='addmedlabel'>Expiry Date</label>
    <br></br>
    <input className='addmedinput' type='date' value={expirydate} onChange={(e)=>setExpiryDate(e.target.value)} placeholder='Enter Expiry Date '/><br></br>
    <button className='addmedbutton'>Submit</button>
    </form>
      </div>
    </div>
  )
}

export default EditMedicine

