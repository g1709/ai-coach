const axios = require("axios");
const { createError } = require("../utils/apiResponse");

const LEETCODE_GRAPHQL = "https://leetcode.com/graphql";

function cleanLeetCodeUsername(input) {
    if (!input) return "";
    let str = String(input).trim();
    try {
        if (str.startsWith("http://") || str.startsWith("https://")) {
            const url = new URL(str);
            const parts = url.pathname.split("/").filter(Boolean);
            if (parts[0] === "u" && parts[1]) {
                return parts[1];
            }
            if (parts[0]) {
                return parts[0];
            }
        }
    } catch (e) {}
    return str.replace(/\/+$/, "").replace(/^@/, "").trim();
}

const QUERY = `
query userData($username: String!) {
  matchedUser(username: $username) {
    username
    profile {
      realName
      userAvatar
    }
    submitStats {
      acSubmissionNum { difficulty count submissions }
      totalSubmissionNum { difficulty count submissions }
    }
    submissionCalendar
    tagProblemCounts {
      advanced { tagName problemsSolved }
      intermediate { tagName problemsSolved }
      fundamental { tagName problemsSolved }
    }
  }
  userContestRanking(username: $username) { rating }
}`;

// [{difficulty:"Easy", count:10}, ...] -> { Easy: {...}, ... }
function byDifficulty(arr = []) {
    return Object.fromEntries(arr.map((x) => [x.difficulty, x]));
}

function parseCalendar(calendarStr) {
    let calendar = {};
    try {
        calendar = typeof calendarStr === "string" ? JSON.parse(calendarStr) : (calendarStr || {});
    } catch (e) {
        calendar = {};
    }

    const now = new Date();
    const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const todaySec = Math.floor(todayUTC.getTime() / 1000);
    const oneDay = 86400;

    // Last 7 days breakdown
    const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const last7Days = [];
    let thisWeekSolved = 0;

    for (let i = 6; i >= 0; i--) {
        const sec = todaySec - i * oneDay;
        const d = new Date(sec * 1000);
        const count = calendar[sec] || calendar[String(sec)] || 0;
        thisWeekSolved += count;
        last7Days.push({
            day: daysMap[d.getUTCDay()],
            date: d.toISOString().slice(0, 10),
            solved: count
        });
    }

    // Calculate streak
    let streak = 0;
    let checkSec = todaySec;
    if (!calendar[checkSec] && !calendar[String(checkSec)]) {
        checkSec -= oneDay; // agar aaj abhi tak submit nahi kiya to kal se check karo
    }
    while (calendar[checkSec] || calendar[String(checkSec)]) {
        streak++;
        checkSec -= oneDay;
    }

    return { last7Days, streak, thisWeekSolved, rawCalendar: calendar };
}

/**
 * @name fetchUserData
 * @description LeetCode se data laata hai aur apne app ke format me normalize karta hai
 */
async function fetchUserData(rawUsername) {
    const username = cleanLeetCodeUsername(rawUsername);
    if (!username) {
        throw createError("Please provide a valid LeetCode username", 400);
    }

    let data;
    try {
        const response = await axios.post(
            LEETCODE_GRAPHQL,
            { query: QUERY, variables: { username } },
            {
                headers: {
                    "Content-Type": "application/json",
                    Referer: "https://leetcode.com",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                },
                timeout: 12000
            }
        );
        data = response.data?.data;
    } catch (err) {
        throw createError("Could not reach LeetCode, try again later", 502);
    }

    const user = data?.matchedUser;
    if (!user) {
        throw createError(`LeetCode user "${username}" not found`, 404);
    }

    const ac = byDifficulty(user.submitStats?.acSubmissionNum);
    const total = byDifficulty(user.submitStats?.totalSubmissionNum);
    const acceptedSubs = ac.All?.submissions || 0;
    const totalSubs = total.All?.submissions || 0;

    // topic wise solved
    const topicSolved = {};
    const tags = user.tagProblemCounts || {};
    [...(tags.advanced || []), ...(tags.intermediate || []), ...(tags.fundamental || [])].forEach((t) => {
        topicSolved[t.tagName] = (topicSolved[t.tagName] || 0) + t.problemsSolved;
    });

    const calendarData = parseCalendar(user.submissionCalendar);

    const totalSolved = ac.All?.count || 0;
    const easySolved = ac.Easy?.count || 0;
    const mediumSolved = ac.Medium?.count || 0;
    const hardSolved = ac.Hard?.count || 0;
    const contestRating = Math.round(data.userContestRanking?.rating || 0);
    const acceptanceRate = totalSubs ? Number(((acceptedSubs / totalSubs) * 100).toFixed(1)) : 0;

    return {
        username: user.username,
        realName: user.profile?.realName || user.username,
        avatarUrl: user.profile?.userAvatar || null,
        totalSolved,
        easySolved,
        mediumSolved,
        hardSolved,
        contestRating,
        acceptanceRate,
        streak: calendarData.streak,
        thisWeekSolved: calendarData.thisWeekSolved,
        last7Days: calendarData.last7Days,
        rawCalendar: calendarData.rawCalendar,
        topicSolved
    };
}

module.exports = { fetchUserData, cleanLeetCodeUsername };
