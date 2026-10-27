const { Router } = require('express');
const rateLimit = require('express-rate-limit');
const aiController = require('../controllers/aiController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { requireFields, validateStudyPlan } = require('../middleware/validationMiddleware');

const aiRouter = Router();

// AI calls paise lagati hain — 1 ghante me max 10
const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "AI request limit reached, try again in an hour" }
});

/**
 * @route POST /api/ai/study-plan
 * @desc Generate a personalized study plan
 * @access Private
 */
aiRouter.post('/study-plan', authMiddleware, aiLimiter, requireFields('goal', 'duration', 'dailyHours'), validateStudyPlan, aiController.createStudyPlan);

aiRouter.get('/study-plan', authMiddleware, aiController.getLatestStudyPlan);

module.exports = aiRouter;
