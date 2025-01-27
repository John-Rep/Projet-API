const Annonce = require("../models/annonce");

exports.postAnnonce = async (req, res)=>{
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

exports.deleteAnnonce = async (req, res)=>{
  try {
    const annonce = await Annonce.findById(req.params.id);
    if (!annonce) {
      return res.status(404).send("Annonce non trouvée");
    }
    await annonce.deleteOne();
    res.status(200).send("Annonce supprimée");
  } catch (err) {
      res.status(500).send("Erreur lors de la suppression de l'annonce" + err);
  }
}

exports.putAnnonce = async (req, res)=>{
  try {
    const annonce = await Annonce.findById(req.params.id);
    if (!annonce) {
      return res.status(404).send("Annonce non trouvée");
    }
    if (req.body.title) {
      annonce.title = req.body.title;
    }
    if (req.body.description) {
      annonce.description = req.body.description;
    }
      const savedAnnonce = await annonce.save();
      res.status(200).json(savedAnnonce);
  } catch (err) {
      res.status(500).send("Erreur lors de la création de l'annonce" + err);
  }
}

exports.putImage = async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id);
    if (!annonce) {
      return res.status(404).send("Annonce non trouvée");
    }
    annonce.image = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };
    await annonce.save();
    res.status(200).json({ message: "Réussite de mise à jour d'image" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'image", error });
  }
}

exports.getImage = async (req, res)=>{
  try {
    const annonce = await Annonce.findById(req.params.id);
    if (!annonce) {
      return res.status(404).send("Annonce non trouvée");
    }
    res.contentType(annonce.image.contentType);
    res.send(annonce.image.data);
  } catch (err) {
    res.status(500).send("Erreur lors de récupération des images");
  }
}

exports.getAnnonce = async (req, res)=>{
  try {
    annonce = await Annonce.findById(req.params.id);
    if (!annonce) {
      return res.status(404).send("Annonce non trouvée");
    }
    res.json(annonce);
  } catch (err) {
    res.status(500).send("Erreur lors de récupération des annonces");
  }
}

exports.getAnnonces = async (req, res)=>{
  try {
    annonce = await Annonce.find()
    res.json(annonce);
  } catch (err) {
    res.status(500).send("Erreur lors de récupération des annonces");
  }
}

exports.isUsersPost = async (req, res, next) => {
  annonce = await Annonce.findById(req.params.id);
  if (!annonce) {
    return res.status(404).send("Annonce non trouvée");
  }
  if (req.id != annonce.user_id) {
      return res.status(403).send("Vous pouvez modifier uniquement vos annonces");
  }
  next();
}