const mongoose = require("mongoose");

// Baad me POST /api/ai/recommendations me use hoga
const recommendationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    problems: [
        {
            title: String,
            slug: String,
            difficulty: { type: String, enum: ["Easy", "Medium", "Hard"] },
            topic: String
        }
    ],
    generatedAt: {
        type: Date,
        default: Date.now
    }
});

const recommendationModel = mongoose.model("Recommendation", recommendationSchema);

module.exports = recommendationModel;
