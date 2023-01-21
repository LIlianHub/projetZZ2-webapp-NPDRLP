const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const gestion_database = require("./gestion_database");
const fs = require("fs");

// en general pour le lire au démarage du serveur
const encodedToken = fs.readFileSync("./data/encoded-token", "utf8");


// Login d'un user
async function login(username, password) {
  return new Promise(async (resolve, reject) => {
    let alreadyExist = await gestion_database.alreadyUser(username);
    if (!alreadyExist) {
      reject("Username inconnu !");
    } else {
      let user = await gestion_database.getUserInfo(username);
      if (!bcrypt.compareSync(password, user.password)) {
        reject("Mot de passe invalide !");
      } else {
        let token = jwt.sign({ id: user.username }, encodedToken);
        resolve({ accessToken: token, userdata: { username: user.username } });
      }
    }
  });
}


// Vérification du token
async function verifyToken(token) {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject("Veuillez vous connecter !");
    }

    jwt.verify(token, encodedToken, (err, decoded) => {
      if (err) {
        reject("Veuillez vous reconnecter !");
      }
      resolve(decoded.id);
    });
  });
}

// Enregistrement d'un user
async function register(username, password) {
  return new Promise(async (resolve, reject) => {
    let alreadyExist = await gestion_database.alreadyUser(username);
    if (alreadyExist) {
      reject("Username déjà utilisé !");
    } else {
      let hashedPassword = bcrypt.hashSync(password, 8);
      gestion_database.insertUser(username, hashedPassword);
      resolve("Utilisateur ajouté avec succès !");
    }
  });
}

module.exports = { register, login, verifyToken };
