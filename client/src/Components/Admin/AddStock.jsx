import axios from 'axios'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function AddStock() {
 const location= useLocation()
const user = location.state
const[quantity,setStock]=useState(user.stock?.[0]?.quantity || 0)
const nav=useNavigate()
   const apiUrl = import.meta.env.VITE_API_URL;
  const onsubmit=async(e)=>{
    e.preventDefault()
    const res=await axios.post(`${apiUrl}addstock`,{quantity,medicine:user._id})
    if(res.data.status=="ok"){
      alert(res.data.message)
      nav('/viewmed')
    }
    
  }

  return (
    <div className='addstckbg' style={{paddingTop:'100px'}}>
     <div >
      <h1 style={{textAlign:'center',marginBottom:'200px'}}>Add Stock</h1>
       <div className='addcrd'>
         <form onSubmit={onsubmit}>
          <label className='addstklabel' style={{marginTop:'200px',fontSize:'30px',marginBottom:'88px'}}>Enter Stock </label>
         <br></br>
          <input className='addstckinput' type='text'value={quantity} onChange={(e)=>setStock(e.target.value)}  style={{marginTop:'20px'}} placeholder='Enter Medicine Stock  '/><br></br>
          <button className='btn'>Submit</button>
        </form>
       </div>
    </div>
    </div>
  )
}

export default AddStock
