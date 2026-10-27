const mongoose = require("mongoose");

const leetCodeStatsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    totalSolved: { type: Number, default: 0 },
    easySolved: { type: Number, default: 0 },
    mediumSolved: { type: Number, default: 0 },
    hardSolved: { type: Number, default: 0 },
    contestRating: { type: Number, default: 0 },
    acceptanceRate: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastSynced: { type: Date, default: Date.now }
});

const leetCodeStatsModel = mongoose.model("LeetCodeStats", leetCodeStatsSchema);

module.exports = leetCodeStatsModel;
