const { Router } = require('express');
const analyticsController = require('../controllers/analyticsController');
const { authMiddleware } = require('../middleware/authMiddleware');

const analyticsRouter = Router();

analyticsRouter.get('/overview', authMiddleware, analyticsController.getOverview);

analyticsRouter.get('/topics', authMiddleware, analyticsController.getTopics);

analyticsRouter.get('/difficulty', authMiddleware, analyticsController.getDifficulty);

analyticsRouter.get('/progress', authMiddleware, analyticsController.getProgress);

analyticsRouter.get('/weaknesses', authMiddleware, analyticsController.getWeaknesses);

module.exports = analyticsRouter;
