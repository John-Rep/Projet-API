const User = require('../models/user');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
require("dotenv").config();
const secret = process.env.JWT_SECRET;
const githubSecret = process.env.GITHUB_CLIENT_SECRET;
const githubClient = process.env.GITHUB_CLIENT_ID;
const githubRedirect = process.env.REDIRECT_URI;

exports.gitAuth = async (req, res) => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClient}&redirect_uri=${githubRedirect}`;
    res.redirect(githubAuthUrl);
}

exports.redirect = async (req, res) => {

    const { code } = req.query;

  if (!code) {
    return res.status(400).send("No code provided");
  }

  try {
    // Exchange code for GitHub access token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: githubClient,
        client_secret: githubSecret,
        code,
        redirect_uri: githubRedirect,
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenResponse.data.access_token;

    // Fetch user info from GitHub
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const userEmailResponse = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const user = userResponse.data;
    const email = userEmailResponse.data.find((email) => email.primary).email;

    // Generate JWT token
    const token = jwt.sign({id: user.id, email: user.email}, secret, {expiresIn : 86400});
    console.log(token);
    res.send({
        token
    });

    // Redirect back to frontend
    res.redirect("index.html"); // Change `/dashboard` to your frontend page
  } catch (error) {
    console.error("OAuth Error:", error);
    res.status(500).json({ error: "OAuth authentication failed" });
  }
}

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
    try {
        const user = await User.findOne({email: req.body.email});
        const validPassword = bcrypt.compareSync(req.body.password, user.password);
        if (validPassword) {
            const token = jwt.sign({id: user.id, email: user.email}, secret, {expiresIn : 86400});
            res.send({
                token
            });
        } else {
            res.status(401).send("Mot de passe incorrect");
        }
    } catch (err) {
        res.status(403).send("email non trouvé");
    }
}