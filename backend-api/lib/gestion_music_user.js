const gestion_database = require("./gestion_database");
const gestion_user = require("./gestion_user");


// Fonction qui recupere les dossiers d'un utilisateur
// Avec les musiques dedans
async function getFoldersUser(username) {
  return new Promise(async (resolve, reject) => {
    resolve(await gestion_database.getUserFoldersAndMusics(username));
  });
}

// Fonction qui supprime le dossier d'un utilisateur
async function deleteFolderUser(folder, token) {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await gestion_user.verifyToken(token);
      gestion_database.verifFolderUser(user, folder);
      gestion_database.deleteFolder(folder);
      resolve(retour);
    } catch (err) {
      reject(err);
    }
  });
}

// Fonction qui ajoute un dossier à un utilisateur
async function addFolderUser(folder, token) {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await gestion_user.verifyToken(token);
      gestion_database.verifFolderUser(user, folder);
      gestion_database.addFolder(folder);
      resolve(retour);
    } catch (err) {
      reject(err);
    }
  });
}

// Fonction qui ajoute une musique dans un dossier d'un utilisateur
async function addMusicInFolderUser(folder, title, artist, token) {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await gestion_user.verifyToken(token);
      gestion_database.verifFolderUser(user, folder);
      gestion_database.insertMusicIntoFolder(artist, title, folder);
      resolve("Musique bien ajoutée");
    } catch (err) {
      reject(err);
    }
  });
}

// Fonction qui supprime une musique dans un dossier d'un utilisateur
async function deleteMusicInFolderUser(idFolder, idMusic, token) {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await gestion_user.verifyToken(token);
      gestion_database.verifFolderUser(user, folder);
      gestion_database.deleteMusicFromFolder(idMusic, idFolder);
      resolve(retour);
    } catch (err) {
      reject(err);
    }
  });
}

// Fonction qui recupere les dossiers d'un utilisateur pour ajouter une musique
async function folderMenuForAddMusic(user) {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(gestion_database.getFolderForAddMusique(user));
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  getFoldersUser,
  deleteFolderUser,
  addFolderUser,
  addMusicInFolderUser,
  deleteMusicInFolderUser,
  folderMenuForAddMusic,
};


