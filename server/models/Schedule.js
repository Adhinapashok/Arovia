const mongoose=require('mongoose')
const {Schema}=mongoose

const ScheduleSchema= new Schema({
   
    date:{
        type:String,
        required:true,
    },
    fromtime:{
        type:String,
        required:true,
    },
     totime:{
        type:String,
        required:true,
    },
 
     doctor:{
        type:mongoose.Schema.Types.ObjectId,ref:'Doctor',required:true,
    },
    
})

module.exports=mongoose.model('Schedule',ScheduleSchema)