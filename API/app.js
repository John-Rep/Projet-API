const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

mongoose.connect('mongodb://localhost:27017/BoiteAnnonces?retryWrites=true&w=majority')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

const auth = require('./controllers/authController');
const jwt = require('./middlewares/jwtauth');
const rateLimiter = require('./middlewares/rateLimiter');
const upload = require('./middlewares/upload');
const annonceCont = require('./controllers/annonceController');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
  }));
app.use(cookieParser());


app.get('/api/annonces', [jwt.verifyToken, jwt.userExists], annonceCont.getAnnonces)
app.post('/api/annonces', [jwt.verifyToken, jwt.userExists, rateLimiter.rateLimiter], annonceCont.postAnnonce)

app.get('/api/annonces/:id', [jwt.verifyToken, jwt.userExists], annonceCont.getAnnonce)
app.put('/api/annonces/:id', [jwt.verifyToken, jwt.userExists, annonceCont.isUsersPost], annonceCont.putAnnonce)

app.put('/api/annonces/:id/image', [jwt.verifyToken, jwt.userExists, annonceCont.isUsersPost], upload.single('image'), annonceCont.putImage)
app.get('/api/annonces/:id/image', [jwt.verifyToken, jwt.userExists], annonceCont.getImage)

app.delete('/api/annonces/:id', [jwt.verifyToken, jwt.userExists, annonceCont.isUsersPost], annonceCont.deleteAnnonce)

app.post('/api/signup', auth.signup);
app.post('/api/login', auth.login);

app.get('/api/oauth/github', auth.gitAuth);
app.get('/api/oauth/redirect', auth.redirect);

module.exports = app;