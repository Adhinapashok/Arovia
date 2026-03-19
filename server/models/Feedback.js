const mongoose=require('mongoose')
const {Schema}=mongoose

const FeedbackSchema= new Schema({
    date:{
        type:String,
        required:true,
    },
     review:{
        type:String,
        required:true,
    },
     rating:{
        type:String,
        required:true,
    },
     user:{
        type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,
    },
})

module.exports=mongoose.model('Feedback',FeedbackSchema)