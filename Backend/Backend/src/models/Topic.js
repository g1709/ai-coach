const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    // LeetCode public data per-topic attempts nahi deta, isliye abhi 0 rahega
    attempted: {
        type: Number,
        default: 0
    },
    solved: {
        type: Number,
        default: 0
    },
    successRate: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        enum: ["Strong", "Developing", "Needs Practice"],
        default: "Needs Practice"
    }
});

// ek user ke liye ek topic sirf ek baar
topicSchema.index({ userId: 1, topic: 1 }, { unique: true });

const topicModel = mongoose.model("Topic", topicSchema);

module.exports = topicModel;
