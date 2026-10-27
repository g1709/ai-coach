const userModel = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateToken, sendTokenCookie } = require("../utils/generateToken");

/**
 * @name registerUser
 * @description Register a new user
 * @access Public
 */
async function registerUser(req, res) {
    const { name, email, password } = req.body;

    const isUserExists = await userModel.findOne({ email: email.toLowerCase().trim() });
    if (isUserExists) {
        return res.status(400).json({ message: "Email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = new userModel({
        name,
        email,
        password: hash
    });

    await user.save();

    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            leetcodeUsername: user.leetcodeUsername
        }
    });
}

/**
 * @name loginUser
 * @description Login a user, expects email and password in the request body
 * @access Public
 */
async function loginUser(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            leetcodeUsername: user.leetcodeUsername
        }
    });
}

/**
 * @name getMe
 * @description Get the logged-in user
 * @access Private
 */
async function getMe(req, res) {
    const user = await userModel.findById(req.user.id).select("-password");

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
        message: "User fetched successfully",
        user
    });
}

/**
 * @name logoutUser
 * @description Cookie clear karke logout
 * @access Private
 */
async function logoutUser(req, res) {
    res.clearCookie("token");

    res.status(200).json({ message: "Logged out successfully" });
}

module.exports = {
    registerUser,
    loginUser,
    getMe,
    logoutUser
}
