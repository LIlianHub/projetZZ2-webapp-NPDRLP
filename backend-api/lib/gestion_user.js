const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");

// en general pour le lire au démarage du serveur
const encodedToken = fs.readFileSync("./data/encoded-token", "utf8");

function register(username, password) {
  //appel base de donnée pour vérifier si le username existe déjà (fonction existUser() dans gestion database)
  //si oui, renvoyer un message d'erreur

  //si non
  let hashedPassword = bcrypt.hashSync(password, 8);
  //ajout dans base de donnée
}

async function login(username, password) {
  return new Promise((resolve, reject) => {
    //on essaye de récupérer l'utilisateur dans la base de donnée
    //si on ne le trouve pas, on renvoie un message d'erreur
    //si il existe, on vérifie le mot de passe
    bcrypt.compareSync(password, hash /*recuperé dans la base de donnée*/); // true
    //si le mot de passe est bon, on renvoie un token et le username

    //sinon on renvoie un message d'erreur

  });
}

//let token = req.headers["x-access-token"];

async function verifyToken(token) {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject("Pas de token fourni");
    }

    jwt.verify(token, encodedToken, (err, decoded) => {
      if (err) {
        reject("Token invalide");
      }
      resolve(decoded.id);
    });
  });
}

async function register(username, password) {
  return new Promise((resolve, reject) => {});
}
