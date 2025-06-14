const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String },
    email: {type: String, required: true},
    password: {type: String, required: true},
    photoUrl: {type: String},
})
module.exports=mongoose.model('User',UserSchema);