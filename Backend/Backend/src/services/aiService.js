const { GoogleGenAI, Type } = require("@google/genai");
const { createError } = require("../utils/apiResponse");

// client lazily banta hai, taaki API key na ho to bhi baaki app chale
let ai = null;
function getClient() {
    if (!process.env.GOOGLE_GENAI_API_KEY) {
        throw createError("AI service not configured (GOOGLE_GENAI_API_KEY missing)", 503);
    }
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });
    }
    return ai;
}

const studyPlanResponseSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "2-3 sentence overview of the overall strategy"
        },
        weeks: {
            type: Type.ARRAY,
            description: "One entry per week of the plan",
            items: {
                type: Type.OBJECT,
                properties: {
                    week: { type: Type.NUMBER, description: "Week number starting from 1" },
                    focus: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Topics to focus on this week"
                    },
                    dailyProblems: { type: Type.NUMBER, description: "Problems to solve per day" },
                    tasks: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Concrete tasks for the week"
                    },
                    tip: { type: Type.STRING, description: "One short tip for this week" }
                },
                required: ["week", "focus", "dailyProblems", "tasks", "tip"]
            }
        }
    },
    required: ["summary", "weeks"]
};

function buildStudyPlanPrompt(ctx) {
    const weeks = Math.ceil(ctx.duration / 7);

    return `You are an expert DSA interview coach.
Create a personalized study plan using ONLY the data below. Do not recalculate or invent any statistics.

STUDENT DATA
- Goal: ${ctx.goal}
- Duration: ${ctx.duration} days (${weeks} weeks)
- Available time: ${ctx.dailyHours} hours per day
- Total solved: ${ctx.stats.totalSolved} (Easy ${ctx.stats.easySolved}, Medium ${ctx.stats.mediumSolved}, Hard ${ctx.stats.hardSolved})
- Contest rating: ${ctx.stats.contestRating}
- Weak topics (prioritize these): ${ctx.weakTopics.join(", ") || "none"}
- Developing topics: ${ctx.developingTopics.join(", ") || "none"}
- Strong topics (only light revision): ${ctx.strongTopics.join(", ") || "none"}
- Problems solved in the last 7 days: ${ctx.recentSolved}

The "weeks" array must have exactly ${weeks} entries. The final week should include mixed practice and mock interviews.
Respond strictly according to the provided JSON schema. Do not include any fields other than those defined in the schema.`;
}

/**
 * @name generateStudyPlan
 * @description Gemini se structured study plan banwata hai (stats backend ne pehle hi calculate kar diye hain)
 */
async function generateStudyPlan(ctx) {
    const client = getClient();

    let response;
    try {
        response = await client.models.generateContent({
            model: process.env.GEMINI_MODEL || "gemini-3-flash-preview",
            contents: buildStudyPlanPrompt(ctx),
            config: {
                responseMimeType: "application/json",
                responseSchema: studyPlanResponseSchema
            }
        });
    } catch (err) {
        console.log("Gemini error:", err.message);
        throw createError("AI request failed, please try again", 502);
    }

    let plan;
    try {
        plan = JSON.parse(response.text);
    } catch (err) {
        throw createError("AI returned an invalid plan, please try again", 502);
    }

    if (!Array.isArray(plan.weeks) || plan.weeks.length === 0) {
        throw createError("AI returned an empty plan, please try again", 502);
    }

    return plan;
}

module.exports = { generateStudyPlan, buildStudyPlanPrompt };
