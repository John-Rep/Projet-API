const User = require('../models/user');
const bcrypt = require("bcryptjs");

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
        res.send("Correct");
    } else {
        res.status(401).send("Mot de passe ou email incorrects");
    }
}