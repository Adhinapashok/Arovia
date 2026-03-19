const mongoose=require('mongoose')
const {Schema}=mongoose

const UserSchema= new Schema({
    name:{
        type:String,
        required:true,
    },
   
     email:{
        type:String,
        required:true,
    },
     mobile:{
        type:String,
        required:true,
    },
     photo:{
        type:String,
        required:true,
    },
     dob:{
        type:String,
        required:true,
    },
     gender:{
        type:String,
        required:true,
    },
     place:{
        type:String,
        required:true,
    },
     pincode:{
        type:String,
        required:true,
    },
    login:{
        type:mongoose.Schema.Types.ObjectId,ref:'Login',
    },
})

module.exports=mongoose.model('User',UserSchema)