const mongoose = require('mongoose');
const schema = mongoose.Schema;

const selfNoteSchema = new schema({
    title: {type:String},
    note:{type:String,required:true},
})

module.exports=mongoose.model('selfNote',selfNoteSchema);

