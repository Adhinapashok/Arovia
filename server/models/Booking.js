const mongoose=require('mongoose')

const BookingSchema= new mongoose.Schema({
    date:{
        type:String,
        required:true,
    },
    time:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
    },
     schedule:{
        type:mongoose.Schema.Types.ObjectId,ref:'Schedule',required:true,
    },
       user:{
        type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,
    },
})

module.exports=mongoose.model('Booking',BookingSchema)