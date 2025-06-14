const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CheckInSchema = new Schema({
    timeStamp: { type: Date, default: Date.now },
    emotion: {
        type: [String],
        enum: ['happy', 'sad', 'anxious', 'excited', 'calm'], // add later
        required: true,
    },
    description: { type: String, required: true },
    activityTag: { type: Schema.Types.ObjectId, ref: 'ActivityTag' },
    placeTag: { type: Schema.Types.ObjectId, ref: 'PlaceTag' },
    peopleTag: { type: Schema.Types.ObjectId, ref: 'PeopleTag' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('CheckIn', CheckInSchema);
