const setRateLimit = require("express-rate-limit");

exports.rateLimiter = setRateLimit({
        windowMs: 1000,
        max: 10,
        message: "Vous ne pouvez pas créer plus que 10 annonces chaque seconde.",
        headers: true,
    });
