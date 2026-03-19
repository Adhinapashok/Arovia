const mongoose=require('mongoose')
const {Schema}=mongoose

const StaffSchema= new Schema({
    name:{
        type:String,
        required:true,
    },
    email : {
        type:String,
        reqiured:true,
        unique:true,
    },
     phoneno : {
        type:String,
        reqiured:true,
    },
    gender: {
        type:String,
        reqiured:true,
    },
     dob : {
        type:String,
        reqiured:true,
    },
    qualification : {
        type:String,
        reqiured:true,
    },
    role : {
        type:String,
        reqiured:true,
    },
    experience : {
        type:String,
        reqiured:true,
    },
    photo : {
        type:String,
        reqiured:true,
    },
   

    
})

module.exports=mongoose.model('Staff',StaffSchema)

