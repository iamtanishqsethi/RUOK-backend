const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String },
    email: {type: String, required: true},
    password: {type: String, required: true},
    photoUrl: {type: String,default: "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png"},
})
module.exports=mongoose.model('User',UserSchema);