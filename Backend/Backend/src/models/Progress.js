const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: Date,
        required: true // din ki shuruaat (UTC)
    },
    problemsSolved: {
        type: Number,
        default: 0
    },
    studyMinutes: {
        type: Number,
        default: 0
    }
});

progressSchema.index({ userId: 1, date: 1 }, { unique: true });

const progressModel = mongoose.model("Progress", progressSchema);

module.exports = progressModel;
