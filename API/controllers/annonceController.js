const Annonce = require("../models/annonce");

exports.postAnnonce = async (req,res)=>{
    try {
        const newAnnonce = new Annonce({
        user_id: req.id,
        title: req.body.title,
        description: req.body.description,
        date: Date()
        });
        const savedAnnonce = await newAnnonce.save();
        res.status(201).json(savedAnnonce);
    } catch (err) {
        res.status(500).send("Erreur lors de la création de l'annonce" + err);
    }
}

exports.getAnnonces = async (req,res)=>{
  annonce = await Annonce.find()
  try {
    res.json(annonce);
  } catch (err) {
    res.status(500).send("Erreur lors de récupération des annonces");
  }
}