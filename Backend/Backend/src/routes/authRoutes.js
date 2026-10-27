const {Router} = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { requireFields, validateRegister } = require('../middleware/validationMiddleware');
const authRouter = Router();

// brute force se bachne ke liye — 15 min me max 20 login/register attempts
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many attempts, please try again later" }
});

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post('/register', authLimiter, requireFields('name', 'email', 'password'), validateRegister, authController.registerUser);

/**
 * @route POST /api/auth/login
 * @desc Login a user with email and password
 * @access Public
 */
authRouter.post('/login', authLimiter, requireFields('email', 'password'), authController.loginUser);

/**
 * @route GET /api/auth/me
 * @desc Get the logged-in user
 * @access Private
 */
authRouter.get('/me', authMiddleware, authController.getMe);

/**
 * @route POST /api/auth/logout
 * @desc Clear the token cookie
 * @access Private
 */
authRouter.post('/logout', authMiddleware, authController.logoutUser);

module.exports = authRouter;
