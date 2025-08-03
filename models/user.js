const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String },
    email: {type: String, required: true},
    bio:{type: String},
    photoUrl: {type: String,default: "https://ui-private.shadcn.com/avatars/02.png"},
    isGuest:{type: Boolean, default: false},
    isGoogleAuth:{type:Boolean, default: false},
    password: {type: String, required: function () {return !this.isGoogleAuth}},
},{timestamps: true});
module.exports=mongoose.model('User',UserSchema);