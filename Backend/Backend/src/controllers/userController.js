const userModel = require("../models/User");

/**
 * @name getProfile
 * @description Get profile of the logged-in user
 * @access Private
 */
async function getProfile(req, res) {
    const user = await userModel.findById(req.user.id).select("-password");

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
        message: "Profile fetched successfully",
        user
    });
}

/**
 * @name updateProfile
 * @description Update name and/or leetcodeUsername of the logged-in user
 * @access Private
 */
async function updateProfile(req, res) {
    const { name, leetcodeUsername } = req.body;

    const updates = {};
    if (name != null && String(name).trim() !== "") updates.name = name;
    if (leetcodeUsername != null && String(leetcodeUsername).trim() !== "") {
        updates.leetcodeUsername = leetcodeUsername;
    }

    const user = await userModel
        .findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true })
        .select("-password");

    res.status(200).json({
        message: "Profile updated successfully",
        user
    });
}

module.exports = { getProfile, updateProfile };
