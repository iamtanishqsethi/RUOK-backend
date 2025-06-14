const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PeopleTagSchema = new Schema({
    userId : {type: Schema.Types.ObjectId, ref: 'User'},
    title : {type: String, required: true},
})

module.exports = mongoose.model('PeopleTag', PeopleTagSchema);