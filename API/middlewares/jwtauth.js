const jwt = require("jsonwebtoken");
const User = require("../models/user")
require("dotenv").config();
const secret = process.env.JWT_SECRET;

exports.verifyToken = async (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send("Pas de Token");
    }
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).send("Unauthorized");
        }
        req.id = decoded.id;
        next();
    });
}

exports.userExists = async (req, res, next) => {
    const user = await User.findOne({_id : req.id})
    if (!user) {
        return res.status(403).send("Utilisateur non trouvé");
    }
    next();
}