const mongoose=require('mongoose')
const {Schema}=mongoose

const StockSchema= new Schema({
    quantity:{
        type:String,
        required:true,
    },
     medicine:{
        type:mongoose.Schema.Types.ObjectId,ref:'Medicine',required:true,
    },
})

module.exports=mongoose.model('Stock',StockSchema)