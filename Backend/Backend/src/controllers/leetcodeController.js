const userModel = require("../models/User");
const leetcodeService = require("../services/leetcodeService");
const analyticsService = require("../services/analyticsService");

function formatLeetCodeResponse(data, message = "LeetCode data fetched successfully") {
    const total = data.totalSolved || 0;
    const easy = data.easySolved || 0;
    const medium = data.mediumSolved || 0;
    const hard = data.hardSolved || 0;

    return {
        message,
        username: data.username,
        realName: data.realName,
        avatarUrl: data.avatarUrl,
        stats: {
            totalSolved: total,
            easy: easy,
            medium: medium,
            hard: hard,
            contestRating: data.contestRating || 0,
            acceptanceRate: data.acceptanceRate || 0,
            streak: data.streak || 0,
            thisWeekSolved: data.thisWeekSolved || 0,
            ratingGain: 32,
            streakGain: data.streak || 0,
            acceptanceGain: 4,
        },
        difficulty: {
            total,
            easy: { count: easy, percent: total ? Math.round((easy / total) * 100) : 0 },
            medium: { count: medium, percent: total ? Math.round((medium / total) * 100) : 0 },
            hard: { count: hard, percent: total ? Math.round((hard / total) * 100) : 0 },
        },
        progress: data.last7Days || [],
        topics: data.topicSolved || {}
    };
}

/**
 * @name connectLeetCode
 * @description LeetCode username connect karo aur data sync karo (supports logged in & preview)
 */
async function connectLeetCode(req, res) {
    const rawInput = req.body.username;
    const data = await leetcodeService.fetchUserData(rawInput);

    if (req.user?.id) {
        await userModel.findByIdAndUpdate(req.user.id, {
            leetcodeUsername: data.username,
            avatarUrl: data.avatarUrl
        });
        await analyticsService.saveSyncedData(req.user.id, data);
    }

    res.status(200).json(formatLeetCodeResponse(data, "LeetCode account connected and synced successfully"));
}

/**
 * @name getPublicLeetCodeData
 * @description Direct username/URL se kisi ki bhi LeetCode profile ka data fetch karo
 */
async function getPublicLeetCodeData(req, res) {
    const rawInput = req.params.username || req.query.username;
    const data = await leetcodeService.fetchUserData(rawInput);
    res.status(200).json(formatLeetCodeResponse(data));
}

/**
 * @name syncLeetCode
 * @description Connected account ka latest data dobara laao aur save karo
 */
async function syncLeetCode(req, res) {
    let targetUsername = req.body?.username;

    if (!targetUsername && req.user?.id) {
        const user = await userModel.findById(req.user.id);
        targetUsername = user?.leetcodeUsername;
    }

    if (!targetUsername) {
        return res.status(400).json({ message: "Provide a LeetCode username or connect your account first" });
    }

    const data = await leetcodeService.fetchUserData(targetUsername);

    if (req.user?.id) {
        await analyticsService.saveSyncedData(req.user.id, data);
    }

    res.status(200).json(formatLeetCodeResponse(data, "Data synced successfully"));
}

/**
 * @name getLeetCodeStats
 */
async function getLeetCodeStats(req, res) {
    if (!req.user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const stats = await analyticsService.getStats(req.user.id);

    if (!stats) {
        return res.status(404).json({ message: "No LeetCode data yet. Connect and sync first." });
    }

    res.status(200).json({
        message: "Stats fetched successfully",
        stats
    });
}

module.exports = { connectLeetCode, syncLeetCode, getLeetCodeStats, getPublicLeetCodeData };
