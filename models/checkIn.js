const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CheckInSchema = new Schema({
    emotion: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Emotion',
    },
    description: {
        type: String,
    },
    activityTag: {
        type: Schema.Types.ObjectId,
        ref: 'ActivityTag'
    },
    placeTag: {
        type: Schema.Types.ObjectId,
        ref: 'PlaceTag'
    },
    peopleTag: {
        type: Schema.Types.ObjectId,
        ref: 'PeopleTag'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User' ,
        required: true
    },
},{timestamps:true})

module.exports = mongoose.model('CheckIn', CheckInSchema);
