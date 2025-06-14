const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivityTagSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
});

module.exports = mongoose.model('ActivityTag', ActivityTagSchema);
