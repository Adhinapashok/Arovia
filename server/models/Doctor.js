const mongoose=require('mongoose')
const {Schema}=mongoose

const DrSchema= new Schema({
    name:{
        type:String,
        required:true,
    },
    email : {
        type:String,
        reqiured:true,
        unique:true,
    },
     mobile : {
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
    specialization : {
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
    login:{
        type:mongoose.Schema.Types.ObjectId,ref:'Login',reqiured:true,
    }

    
})

module.exports=mongoose.model('Doctor',DrSchema)

