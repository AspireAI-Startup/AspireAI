import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 60 * 1000 * 5,
    max: 5,
    message: {
        status: 429,
        message: 'Too many requests, Please try again later.'
    }
});

export { limiter };