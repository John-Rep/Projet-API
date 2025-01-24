const mongoose = require('mongoose');
const express = require('express');
mongoose.connect('mongodb://localhost:27017/BoiteAnnonces?retryWrites=true&w=majority')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
app.use(express.json());
const auth = require('./controllers/authController');
const jwt = require('./middlewares/jwtauth');
const annonceCont = require('./controllers/annonceController');

app.get('/api/annonces', [jwt.verifyToken, jwt.userExists], annonceCont.getAnnonces)
app.post('/api/annonces', [jwt.verifyToken, jwt.userExists], annonceCont.postAnnonce)

app.post('/api/signup', auth.signup);
app.post('/api/login', auth.login);

module.exports = app;