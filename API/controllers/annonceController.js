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

exports.putImage = async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id);
    annonce.image = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };
    await annonce.save();
    res.status(201).json({ message: 'Image uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image', error });
  }
}

exports.getImage = async (req, res)=>{
  const annonce = await Annonce.findById(req.params.id);
  try {
    res.contentType(annonce.image.contentType);
    res.send(annonce.image.data);
  } catch (err) {
    res.status(500).send("Erreur lors de récupération des images");
  }
}

exports.getAnnonce = async (req, res)=>{
  annonce = await Annonce.findById(req.params.id)
  try {
    res.json(annonce);
  } catch (err) {
    res.status(500).send("Erreur lors de récupération des annonces");
  }
}

exports.getAnnonces = async (req, res)=>{
  annonce = await Annonce.find()
  try {
    res.json(annonce);
  } catch (err) {
    res.status(500).send("Erreur lors de récupération des annonces");
  }
}

exports.isUsersPost = async (req, res, next) => {
  annonce = await Annonce.findById(req.params.id);
  if (req.id != annonce.user_id) {
      return res.status(403).send("Vous pouvez modifier uniquement vos annonces");
  }
  next();
}