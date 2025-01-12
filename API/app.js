const mongoose = require('mongoose');
const express = require('express');
mongoose.connect('mongodb://localhost:27017/BoiteAnnonces?retryWrites=true&w=majority')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
app.use(express.json());
const Annonce = require('./annonces');
app.get('/api/annonces', async (req,res)=>{
  annonce = await Annonce.find()
  try {
    res.json(annonce);
  } catch (err) {
    res.status(500).send("Error in getting the announcements");
  }
})

app.post('/api/annonces', async (req,res)=>{
  try {
    const newAnnonce = new Annonce({
      user_id: req.body.user_id,
      title: req.body.title,
      content: req.body.content,
      date: Date()
    });
    const savedAnnonce = await newAnnonce.save();
    res.status(201).json(savedAnnonce);
  } catch (err) {
    res.status(500).send("Erreur lors de la création de l'annonce" + err);
  }
})


module.exports = app;