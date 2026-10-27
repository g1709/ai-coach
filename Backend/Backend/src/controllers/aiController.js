const studyPlanModel = require("../models/StudyPlan");
const analyticsService = require("../services/analyticsService");
const aiService = require("../services/aiService");

/**
 * @name createStudyPlan
 * @description Weak topics + stats + goal ke basis par AI study plan generate karo
 * @access Private
 */
async function createStudyPlan(req, res) {
    const { goal, duration, dailyHours } = req.body;
    const userId = req.user.id;

    const stats = await analyticsService.getStats(userId);
    if (!stats) {
        return res.status(400).json({ message: "Connect and sync LeetCode before generating a plan" });
    }

    // Saari calculation backend karta hai, AI ko sirf final numbers milte hain
    const weaknesses = await analyticsService.getWeaknesses(userId);
    const last7Days = await analyticsService.getProgress(userId, 7);
    const recentSolved = last7Days.reduce((sum, d) => sum + d.problemsSolved, 0);

    const plan = await aiService.generateStudyPlan({
        goal,
        duration,
        dailyHours,
        stats,
        recentSolved,
        ...weaknesses
    });

    const studyPlan = new studyPlanModel({ userId, goal, duration, dailyHours, plan });
    await studyPlan.save();

    res.status(201).json({
        message: "Study plan generated successfully",
        studyPlan
    });
}

/**
 * @name getLatestStudyPlan
 * @description Sabse latest saved study plan
 * @access Private
 */
async function getLatestStudyPlan(req, res) {
    const studyPlan = await studyPlanModel.findOne({ userId: req.user.id }).sort({ createdAt: -1 });

    if (!studyPlan) {
        return res.status(404).json({ message: "No study plan yet" });
    }

    res.status(200).json({
        message: "Study plan fetched successfully",
        studyPlan
    });
}

module.exports = { createStudyPlan, getLatestStudyPlan };
