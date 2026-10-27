const { Router } = require('express');
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

const userRouter = Router();

userRouter.get('/profile', authMiddleware, userController.getProfile);

userRouter.put('/profile', authMiddleware, userController.updateProfile);

module.exports = userRouter;
