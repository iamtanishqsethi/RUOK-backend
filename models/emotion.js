const mongoose = require('mongoose');

const emotionSchema=new mongoose.Schema ({
    title:{
        type:String,
        required:true,
        unique:true,
    },
    description:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:['High Energy Unpleasant','Low Energy Unpleasant','High Energy Pleasant','Low Energy Pleasant'],
        required:true
    },
    intensity:{
        type:Number,
        required:true,
    }
})

module.exports=mongoose.model('Emotion', emotionSchema);