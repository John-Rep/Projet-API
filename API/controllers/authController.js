const User = require('../models/user');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;

exports.signup = async (req, res) => {
    try {
        const newUser = new User({
            lastName: req.body.lastName,
            firstName: req.body.firstName,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password),
        });
        await newUser.save();
        res.send("Nouvel utilisateur enregistré");
    } catch (err) {
        console.log(err);
        res.status(500).send("Erreur de création de compte");
    }
}

exports.login = async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    const validPassword = bcrypt.compareSync(req.body.password, user.password);
    if (validPassword) {
        const token = jwt.sign({id: user.id, email: user.email}, secret, {expiresIn : 86400})
        res.send({
            token
        });
    } else {
        res.status(401).send("Mot de passe ou email incorrects");
    }
}