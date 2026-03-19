const mongoose=require('mongoose')
const {Schema}=mongoose

const LoginSchema= new mongoose.Schema({
    Username:{
        type:String,
        required:true,
    },
    Password:{
        type:String,
        required:true,
    },
    Role:{
        type:String,
        enum:['admin','doctor','user'],
        required:true,
    },
})

module.exports=mongoose.model('Login',LoginSchema)
