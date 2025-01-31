const User = require('../models/user');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { OAuth2Client } = require('google-auth-library');
require("dotenv").config();
const secret = process.env.JWT_SECRET;
const githubSecret = process.env.GITHUB_CLIENT_SECRET;
const githubClient = process.env.GITHUB_CLIENT_ID;
const githubRedirect = process.env.REDIRECT_URI;
const googleSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleClient = process.env.GOOGLE_CLIENT_ID;
const googleRedirect = process.env.GOOGLE_REDIRECT_URI;

exports.gitAuth = async (req, res) => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClient}&redirect_uri=${githubRedirect}&scope=user:email`;
    res.redirect(githubAuthUrl);
}
exports.googleAuth = async (req, res) => {
    const scope = 'openid profile email';  // Scopes to request
    const response_type = 'code';
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
                    `client_id=${googleClient}` +
                    `&redirect_uri=${googleRedirect}` +
                    `&scope=${encodeURIComponent(scope)}` +
                    `&response_type=${response_type}`;
    res.redirect(googleAuthUrl);
}

exports.redirect = async (req, res) => {

    const { code } = req.body;

  if (!code) {
    return res.status(400).send("No code provided");
  }

  try {
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

    const oauthUser = userResponse.data;
    const email = userEmailResponse.data.find((email) => email.primary).email;

    let user = await User.findOne({email : email})

    if(!user) {
        try {
            const newUser = new User({
                lastName: "None",
                firstName: oauthUser.login,
                email: email,
                password: bcrypt.hashSync("1234"),
            });
            user = await newUser.save();
        } catch (err) {
            console.log(err);
            res.status(500).send("Erreur de création de compte");
        }
    }

    const token = jwt.sign({id: user.id, email: email}, secret, {expiresIn : 86400});
    res.json({token: token});

  } catch (error) {
    console.error("OAuth Error:", error);
    res.status(500).json({ error: "OAuth authentication failed" });
  }
}

exports.redirectGoogle = async (req, res) => {

    const { code } = req.body;

    console.log(code);

  if (!code) {
    return res.status(400).send("No code provided");
  }

  const client = new OAuth2Client(googleClient);

  try {
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        client_id: googleClient,
        client_secret: googleSecret,
        code,
        redirect_uri: googleRedirect,
        grant_type: 'authorization_code',
      },
      { headers: { "Content-Type": "application/json" } }
    );
    
    console.log(tokenResponse);

    const id_token = tokenResponse.data.id_token;

    console.log(id_token);

    const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: googleClient,
      });
  
      // Extract user information from the verified token
      const userdata = ticket.getPayload();
      console.log('User info:', userdata);

    const email = userdata.email;

    let user = await User.findOne({email : email})

    if(!user) {
        try {
            const newUser = new User({
                lastName: userdata.family_name,
                firstName: userdata.given_name,
                email: email,
                password: bcrypt.hashSync("1234"),
            });
            user = await newUser.save();
        } catch (err) {
            console.log(err);
            res.status(500).send("Erreur de création de compte");
        }
    }

    const token = jwt.sign({id: user.id, email: email}, secret, {expiresIn : 86400});
    res.json({token: token});

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