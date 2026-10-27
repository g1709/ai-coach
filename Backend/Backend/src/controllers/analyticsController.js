const analyticsService = require("../services/analyticsService");

const NO_DATA = { message: "No LeetCode data yet. Connect and sync first." };

/**
 * @name getOverview
 * @description Dashboard overview — total solved, difficulty counts, rating
 * @access Private
 */
async function getOverview(req, res) {
    const stats = await analyticsService.getStats(req.user.id);
    if (!stats) return res.status(404).json(NO_DATA);

    res.status(200).json({
        totalSolved: stats.totalSolved,
        easy: stats.easySolved,
        medium: stats.mediumSolved,
        hard: stats.hardSolved,
        contestRating: stats.contestRating,
        acceptanceRate: stats.acceptanceRate,
        streak: stats.streak || 0,
        lastSynced: stats.lastSynced
    });
}

/**
 * @name getTopics
 * @description Topic wise success rate aur category
 * @access Private
 */
async function getTopics(req, res) {
    const stats = await analyticsService.getStats(req.user.id);
    if (!stats) return res.status(404).json(NO_DATA);

    const topics = await analyticsService.getTopics(req.user.id);

    res.status(200).json({
        topics: topics.map((t) => ({
            name: t.topic,
            solved: t.solved,
            successRate: t.successRate,
            category: t.category
        }))
    });
}

/**
 * @name getDifficulty
 * @description Easy / Medium / Hard ka count aur percentage
 * @access Private
 */
async function getDifficulty(req, res) {
    const stats = await analyticsService.getStats(req.user.id);
    if (!stats) return res.status(404).json(NO_DATA);

    res.status(200).json(analyticsService.difficultyBreakdown(stats));
}

/**
 * @name getProgress
 * @description Last N din ki daily progress (default 30, max 365)
 * @access Private
 */
async function getProgress(req, res) {
    const days = Math.min(Math.max(parseInt(req.query.days, 10) || 30, 1), 365);
    const progress = await analyticsService.getProgress(req.user.id, days);

    res.status(200).json({ days, progress });
}

/**
 * @name getWeaknesses
 * @description Weak / developing / strong topics
 * @access Private
 */
async function getWeaknesses(req, res) {
    const stats = await analyticsService.getStats(req.user.id);
    if (!stats) return res.status(404).json(NO_DATA);

    const result = await analyticsService.getWeaknesses(req.user.id);

    res.status(200).json(result);
}

module.exports = { getOverview, getTopics, getDifficulty, getProgress, getWeaknesses };
