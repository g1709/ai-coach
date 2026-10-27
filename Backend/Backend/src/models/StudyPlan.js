const mongoose = require("mongoose");

const studyPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    goal: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    dailyHours: {
        type: Number,
        required: true
    },
    plan: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
}, { timestamps: { createdAt: true, updatedAt: false } });

const studyPlanModel = mongoose.model("StudyPlan", studyPlanSchema);

module.exports = studyPlanModel;
