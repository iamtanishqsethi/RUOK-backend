const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const toolFeedbackSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    toolName:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true,
        min:0,
        max:100
    },
    checkIn:{
        type:Schema.Types.ObjectId,
        ref:'CheckIn',
        required:true
    }
    },{timestamps:true}
)
module.exports=mongoose.model('ToolFeedback',toolFeedbackSchema)