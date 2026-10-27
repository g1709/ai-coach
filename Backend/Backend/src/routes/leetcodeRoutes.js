const { Router } = require('express');
const leetcodeController = require('../controllers/leetcodeController');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/authMiddleware');
const { requireFields } = require('../middleware/validationMiddleware');

const leetcodeRouter = Router();

// Connect any LeetCode ID (supports both logged-in users & preview/demo mode)
leetcodeRouter.post('/connect', optionalAuthMiddleware, requireFields('username'), leetcodeController.connectLeetCode);

// Direct public endpoint: fetch any user's real LeetCode stats
leetcodeRouter.get('/user/:username', leetcodeController.getPublicLeetCodeData);

// Sync latest data
leetcodeRouter.post('/sync', optionalAuthMiddleware, leetcodeController.syncLeetCode);

// Get saved user stats
leetcodeRouter.get('/stats', authMiddleware, leetcodeController.getLeetCodeStats);

module.exports = leetcodeRouter;
