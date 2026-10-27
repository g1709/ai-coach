/**
 * @name createError
 * @description Status code ke saath error banata hai — errorMiddleware isse JSON me convert karta hai
 */
function createError(message, statusCode = 500) {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
}

module.exports = { createError };
