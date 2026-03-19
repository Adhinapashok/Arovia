import React, { useState } from 'react'
import './AddMedicine.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
function AddMedicine() {

   const[medicine,setMedicine]=useState('')
   const[brand,setBrand]=useState('')
   const[category,setCategory]=useState('')
   const[dosagestrength,SetDosageStrength]=useState('')
   const[manufacture,SetManufacture]=useState('')
   const[price,setPrice]=useState('')
   const[expirydate,setExpiryDate]=useState('')

    const nav=useNavigate()
   const apiUrl = import.meta.env.VITE_API_URL;
   const onsubmit=async(e)=>{
    e.preventDefault()
    const res=await axios.post(`${apiUrl}addmed`,{medicine,brand,category,dosagestrength,manufacture,price,expirydate})
    if(res.data.status=="ok"){
      alert(res.data.message)
      nav('/home')
    }
    
  }
  return (
    <div>
      <div className='addmedbox'>
    <form onSubmit={onsubmit}>
     <label className='addmedlabel'>Medicine Name</label>
     <br></br>
     <input className='addmedinput' type='text' onChange={(e)=>setMedicine(e.target.value)} placeholder='Enter Medicine Name'/><br></br>
    <label className='addmedlabel'>Brand Name</label>
    <br></br>
    <input className='addmedinput' type='text' onChange={(e)=>setBrand(e.target.value)}placeholder='Enter Brand Name '/><br></br>
    <label className='addmedlabel'>Category</label>
    <br></br>
    <select   className='selectaddmed'  onChange={(e)=>setCategory(e.target.value)}/*style={{marginBottom:'15px'}}*/>
            <option disabled selected value="">Choose Category</option>
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
     <input className='addmedinput' type='text' onChange={(e)=>SetDosageStrength(e.target.value)} placeholder='Enter Dosage Strength'/><br></br> 
     <label className='addmedlabel'>Manufacture</label>
     <br></br>
     <input className='addmedinput' type='date' onChange={(e)=>SetManufacture(e.target.value)} placeholder='Enter Manufacture'/><br></br>       
  <label className='addmedlabel'>Price</label>
    <br></br>
    <input className='addmedinput' type='text' onChange={(e)=>setPrice(e.target.value)} placeholder='Enter Price '/><br></br>
    <label className='addmedlabel'>Expiry Date</label>
    <br></br>
    <input className='addmedinput' type='date' onChange={(e)=>setExpiryDate(e.target.value)} placeholder='Enter Expiry Date '/><br></br>
    <button className='addmedbutton'>Submit</button>
    </form>
      </div>
    </div>
  )
}

export default AddMedicine
