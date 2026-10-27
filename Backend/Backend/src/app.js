const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { CLIENT_URL } = require('./config/env');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
app.use(helmet())
app.use(express.json({ limit: "10kb" }))
app.use(cookieParser())
app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}))

// poore API ke liye general limit
app.use('/api', rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests, please slow down" }
}))


// require all the routes here
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const leetcodeRouter = require('./routes/leetcodeRoutes');
const analyticsRouter = require('./routes/analyticsRoutes');
const aiRouter = require('./routes/aiRoutes');

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: "OK" })
})

//using all routes here
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/leetcode', leetcodeRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/ai', aiRouter);

// Serve Frontend dist files if available, otherwise redirect to dev server
const path = require('path');
const frontendDist = path.resolve(__dirname, '../../..', 'Frontend', 'dist');
app.use(express.static(frontendDist));

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
        if (err) {
            res.redirect(CLIENT_URL || 'http://localhost:5173');
        }
    });
});

// ye hamesha routes ke baad
app.use(notFound);
app.use(errorHandler);

module.exports = app;
