const mongoose = require('mongoose');
//ObjectID = mongoose.ObjectID;
const AnnonceSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "No content to be displayed" },
    image: { data: Buffer, contentType: String },
    date: { type: Date }
});

const Annonces = mongoose.model('Annonces', AnnonceSchema);

module.exports = Annonces;