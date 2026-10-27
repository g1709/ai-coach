const leetCodeStatsModel = require("../models/LeetCodeStats");
const topicModel = require("../models/Topic");
const progressModel = require("../models/Progress");
const userModel = require("../models/User");

// Jin topics ko track karna hai (naam LeetCode ke tag names se match karte hain)
const CORE_TOPICS = [
    "Array", "String", "Hash Table", "Two Pointers", "Sliding Window", "Linked List",
    "Stack", "Queue", "Binary Search", "Tree", "Graph", "Heap (Priority Queue)",
    "Backtracking", "Greedy", "Dynamic Programming"
];

// LeetCode per-topic attempts nahi deta, isliye: successRate = solved / 30 (max 100%)
const TOPIC_TARGET = 30;
const STRONG_AT = 70;
const DEVELOPING_AT = 40;

// ---------- pure functions (no DB, no AI) — AI se math kabhi nahi karwana ----------

function classify(rate) {
    if (rate >= STRONG_AT) return "Strong";
    if (rate >= DEVELOPING_AT) return "Developing";
    return "Needs Practice";
}

function difficultyBreakdown({ easySolved = 0, mediumSolved = 0, hardSolved = 0 }) {
    const total = easySolved + mediumSolved + hardSolved;
    const percent = (n) => (total ? Math.round((n / total) * 100) : 0);

    return {
        total,
        easy: { count: easySolved, percent: percent(easySolved) },
        medium: { count: mediumSolved, percent: percent(mediumSolved) },
        hard: { count: hardSolved, percent: percent(hardSolved) }
    };
}

function buildTopics(topicSolved = {}) {
    return CORE_TOPICS.map((topic) => {
        const solved = topicSolved[topic] || 0;
        const successRate = Math.min(100, Math.round((solved / TOPIC_TARGET) * 100));
        return { topic, solved, successRate, category: classify(successRate) };
    });
}

// ---------- DB functions ----------

function startOfTodayUTC() {
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    return d;
}

/**
 * @name saveSyncedData
 * @description Fresh LeetCode data save karta hai: stats + topics + aaj ki progress (naye solved problems)
 */
async function saveSyncedData(userId, data) {
    const prev = await leetCodeStatsModel.findOne({ userId });
    const newlySolved = prev ? Math.max(0, data.totalSolved - prev.totalSolved) : 0;

    const stats = await leetCodeStatsModel.findOneAndUpdate(
        { userId },
        {
            $set: {
                totalSolved: data.totalSolved,
                easySolved: data.easySolved,
                mediumSolved: data.mediumSolved,
                hardSolved: data.hardSolved,
                contestRating: data.contestRating,
                acceptanceRate: data.acceptanceRate,
                streak: data.streak || 0,
                lastSynced: new Date()
            }
        },
        { upsert: true, new: true }
    );

    if (data.avatarUrl) {
        await userModel.findByIdAndUpdate(userId, { avatarUrl: data.avatarUrl });
    }

    const topics = buildTopics(data.topicSolved);
    await topicModel.bulkWrite(
        topics.map((t) => ({
            updateOne: {
                filter: { userId, topic: t.topic },
                update: { $set: { solved: t.solved, successRate: t.successRate, category: t.category } },
                upsert: true
            }
        }))
    );

    if (data.rawCalendar && Object.keys(data.rawCalendar).length > 0) {
        const calendar = data.rawCalendar;
        const now = new Date();
        const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const oneDaySec = 86400;

        const ops = [];
        for (let i = 0; i < 30; i++) {
            const dayTime = todayUTC.getTime() - i * oneDaySec * 1000;
            const dayDate = new Date(dayTime);
            const sec = Math.floor(dayTime / 1000);
            const count = calendar[sec] || calendar[String(sec)] || 0;
            ops.push({
                updateOne: {
                    filter: { userId, date: dayDate },
                    update: { $set: { problemsSolved: count } },
                    upsert: true
                }
            });
        }
        if (ops.length > 0) {
            await progressModel.bulkWrite(ops);
        }
    } else if (newlySolved > 0) {
        await progressModel.updateOne(
            { userId, date: startOfTodayUTC() },
            { $inc: { problemsSolved: newlySolved }, $setOnInsert: { studyMinutes: 0 } },
            { upsert: true }
        );
    }

    return { stats, newlySolved };
}

async function getStats(userId) {
    return leetCodeStatsModel.findOne({ userId });
}

async function getTopics(userId) {
    return topicModel.find({ userId }).sort({ successRate: -1 }).lean();
}

async function getWeaknesses(userId) {
    const topics = await topicModel.find({ userId }).sort({ successRate: 1 }).lean();
    const namesOf = (category) => topics.filter((t) => t.category === category).map((t) => t.topic);

    return {
        weakTopics: namesOf("Needs Practice"),
        developingTopics: namesOf("Developing"),
        strongTopics: namesOf("Strong")
    };
}

// last N din ki progress, jis din kuch solve nahi kiya wahan 0
async function getProgress(userId, days = 30) {
    const since = startOfTodayUTC();
    since.setUTCDate(since.getUTCDate() - (days - 1));

    const rows = await progressModel.find({ userId, date: { $gte: since } }).lean();
    const byDate = new Map(rows.map((r) => [r.date.toISOString().slice(0, 10), r]));

    const result = [];
    for (let i = 0; i < days; i++) {
        const d = new Date(since);
        d.setUTCDate(since.getUTCDate() + i);
        const key = d.toISOString().slice(0, 10);

        result.push({
            date: key,
            problemsSolved: byDate.get(key)?.problemsSolved || 0,
            studyMinutes: byDate.get(key)?.studyMinutes || 0
        });
    }
    return result;
}

module.exports = {
    CORE_TOPICS, TOPIC_TARGET, classify, difficultyBreakdown, buildTopics,
    saveSyncedData, getStats, getTopics, getWeaknesses, getProgress
};
