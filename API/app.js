const mongoose = require('mongoose');
const express = require('express');

mongoose.connect('mongodb://localhost:27017/BoiteAnnonces?retryWrites=true&w=majority')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

const auth = require('./controllers/authController');
const jwt = require('./middlewares/jwtauth');
const rateLimiter = require('./middlewares/rateLimiter');
const upload = require('./middlewares/upload');
const annonceCont = require('./controllers/annonceController');

app.use(express.json());


app.get('/api/annonces', [jwt.verifyToken, jwt.userExists], annonceCont.getAnnonces)
app.post('/api/annonces', [jwt.verifyToken, jwt.userExists, rateLimiter.rateLimiter], annonceCont.postAnnonce)

app.get('/api/annonces/:id', [jwt.verifyToken, jwt.userExists], annonceCont.getAnnonce)
app.put('/api/annonces/:id', [jwt.verifyToken, jwt.userExists, annonceCont.isUsersPost], annonceCont.putAnnonce)

app.put('/api/annonces/:id/image', [jwt.verifyToken, jwt.userExists, annonceCont.isUsersPost], upload.single('image'), annonceCont.putImage)
app.get('/api/annonces/:id/image', [jwt.verifyToken, jwt.userExists], annonceCont.getImage)

app.delete('/api/annonces/:id', [jwt.verifyToken, jwt.userExists, annonceCont.isUsersPost], annonceCont.deleteAnnonce)

app.post('/api/signup', auth.signup);
app.post('/api/login', auth.login);

module.exports = app;