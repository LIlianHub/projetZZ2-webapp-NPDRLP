const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const gestion_database = require("./gestion_database");
const fs = require("fs");

// en general pour le lire au démarage du serveur
const encodedToken = fs.readFileSync("./data/encoded-token", "utf8");

async function login(username, password) {
  return new Promise(async (resolve, reject) => {
    let test = await gestion_database.alreadyUser(username);
    if (test) {
      reject("Username inconnu !");
    } else {
      let user = gestion_database.getUserInfo(username);
      if (!bcrypt.compareSync(password, user.password)) {
        reject("Mot de passe invalide !");
      } else {
        let token = jwt.sign({ id: user.username }, encodedToken);
        resolve({ accessToken: token, userdata: { username: user.username } });
      }
    }
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
  return new Promise(async (resolve, reject) => {
    let test = await gestion_database.alreadyUser(username);
    if (!test) {
      reject("Username déjà utilisé !");
    } else {
      let hashedPassword = bcrypt.hashSync(password, 8);
      gestion_database.insertUser(username, hashedPassword);
      resolve("Utilisateur ajouté avec succès !");
    }
  });
}

module.exports = { register, login };
