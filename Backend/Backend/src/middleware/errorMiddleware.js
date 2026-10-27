function notFound(req, res, next) {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Central error handler — controllers me try/catch ki zaroorat nahi (Express 5 async errors khud pakadta hai)
function errorHandler(err, req, res, next) {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Server error";

    if (err.code === 11000) {
        statusCode = 409;
        message = "Already exists";
    } else if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map((e) => e.message).join(", ");
    } else if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid ${err.path}`;
    } else if (err.type === "entity.parse.failed") {
        statusCode = 400;
        message = "Invalid JSON body";
    }

    if (statusCode === 500) {
        console.log(err);
        if (process.env.NODE_ENV === "production") message = "Something went wrong";
    }

    res.status(statusCode).json({ message });
}

module.exports = { notFound, errorHandler };
