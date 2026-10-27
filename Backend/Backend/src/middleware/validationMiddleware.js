/**
 * @name requireFields
 * @description Check karta hai ki body me saari required fields hain
 * Usage: router.post('/register', requireFields('name', 'email', 'password'), controller)
 */
function requireFields(...fields) {
    return (req, res, next) => {
        const body = req.body || {};
        const missing = fields.filter(
            (f) => body[f] === undefined || body[f] === null || String(body[f]).trim() === ""
        );

        if (missing.length > 0) {
            return res.status(400).json({ message: `Required fields: ${missing.join(", ")}` });
        }
        next();
    };
}

function validateRegister(req, res, next) {
    const { email, password } = req.body;

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ message: "Valid email required" });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    next();
}

function validateStudyPlan(req, res, next) {
    const duration = Number(req.body.duration);
    const dailyHours = Number(req.body.dailyHours);

    if (!Number.isInteger(duration) || duration < 1 || duration > 180) {
        return res.status(400).json({ message: "duration must be a whole number between 1 and 180 days" });
    }
    if (Number.isNaN(dailyHours) || dailyHours < 0.5 || dailyHours > 12) {
        return res.status(400).json({ message: "dailyHours must be between 0.5 and 12" });
    }

    req.body.duration = duration;
    req.body.dailyHours = dailyHours;
    next();
}

module.exports = { requireFields, validateRegister, validateStudyPlan };
