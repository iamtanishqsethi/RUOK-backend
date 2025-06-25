const mongoose = require('mongoose');
const schema = mongoose.Schema;

const selfNoteSchema = new schema({
    userId: {
        type: schema.Types.ObjectId,
        ref: 'User' ,
        required: true
    },
    title: {type:String},
    note:{type:String,required:true},
})

module.exports=mongoose.model('selfNote',selfNoteSchema);

