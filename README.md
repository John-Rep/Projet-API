# Boite à Annonces

Boite à Annonces est une plateforme permettant de publier et consulter des annonces facilement.

## Installation et Exécution du Projet en Local

### 🔹 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** ([Télécharger ici](https://nodejs.org/))
- **MongoDB** ([Télécharger ici](https://www.mongodb.com/try/download/community))
- **Live Server** (extension VS Code recommandée)

### 🔹 Étapes d'installation

1. **Cloner le projet**  
   Ouvrez un terminal et exécutez :

   ```bash
   git clone https://github.com/John-Rep/Projet-API.git
   ```
   
   Une fois le repository cloné, accédez au dossier du projet et installez les dépendances nécessaires avec npm :
   
   ```bash
   cd API
   node server.js
   ```

   Lancer le serveur :

   ```bash
   node server.js
   ```
   
   Lancer le client avec Live Server :

   Ouvrez le fichier index.html et utilisez Live Server pour démarrer le projet.
   Cela est nécessaire pour avoir l'origine 127.0.0.1:5500 et éviter des problèmes avec les cookies.

### 🔹 Configuration des Cookies

Si vous utilisez Google Chrome, vous devez autoriser les cookies tiers pour assurer le bon fonctionnement du site.
Pour ce faire :

   1. Allez dans Paramètres → Confidentialité et sécurité → Cookies et autres données des sites.
   2. Activez l'option Autoriser tous les cookies ou ajoutez 127.0.0.1 aux exceptions.

### 🛠️ Technologies Utilisées
- Frontend : HTML, CSS, JavaScript
- Backend : Node.js, Express
- Base de données : MongoDB

### Auteurs
Développé par John Replogle et Timothé Winkler
