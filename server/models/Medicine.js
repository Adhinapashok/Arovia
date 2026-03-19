const mongoose=require('mongoose')
const {Schema}=mongoose

const MedicineSchema= new Schema({
    medname:{
        type:String,
        required:true,
    },
    brandname:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    dosagestrength:{
        type:String,
        required:true,
    },
    manufacture:{
        type:String,
        required:true,
    },
    price:{
        type:String,
        required:true,
    },
     expirydate:{
        type:String,
        required:true,
    },
  
    
    
})

module.exports=mongoose.model('Medicine',MedicineSchema)