require("dotenv").config()

function validateEnv() {
    const required = ["MONGO_URI", "JWT_SECRET"]
    const missing = required.filter((key) => !process.env[key])

    if (missing.length > 0) {
        console.log(`Missing required env variables: ${missing.join(", ")}`)
        process.exit(1)
    }

    if (!process.env.GOOGLE_GENAI_API_KEY) {
        console.log("Warning: GOOGLE_GENAI_API_KEY missing — AI study plan kaam nahi karega")
    }
}

module.exports = {
    validateEnv,
    PORT: process.env.PORT || 3000,
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173"
}