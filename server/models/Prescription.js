const mongoose=require('mongoose')
const {Schema}=mongoose

const PrescriptionSchema= new Schema({
    date:{
        type:String,
        required:true,
    },
     Prescription:{
        type:String,
        required:true,
    },

    Diagnosis:{
        type:String,
        required:true,
    },

     booking:{
        type:mongoose.Schema.Types.ObjectId,ref:'Booking',required:true,
    },
})

module.exports=mongoose.model('Prescription',PrescriptionSchema)