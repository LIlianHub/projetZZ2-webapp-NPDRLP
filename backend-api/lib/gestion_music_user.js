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
async function deleteFolderUser(idFolder, token) {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await gestion_user.verifyToken(token);
      await gestion_database.verifFolderUser(user, idFolder);
      gestion_database.deleteFolder(idFolder);
      resolve("Dossier Supprimé");
    } catch (err) {
      reject(err);
    }
  });
}

// Fonction qui ajoute un dossier à un utilisateur
async function addFolderUser(folderName, token) {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await gestion_user.verifyToken(token);
      gestion_database.addFolder(folderName, user);
      resolve("Dossier bien ajouté");
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
      await gestion_database.verifFolderUser(user, folder);
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
      await gestion_database.verifFolderUser(user, idFolder);
      gestion_database.deleteMusicFromFolder(idMusic, idFolder);
      resolve("Musique supprimée du Dossier");
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

// Fonction qui renomme un dossier d'un user
async function renameFolderUser(idFolder, newName, token) {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await gestion_user.verifyToken(token);
      await gestion_database.verifFolderUser(user, idFolder);
      gestion_database.renameFolder(idFolder, newName);
      resolve("Dossier renommé !");
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
  renameFolderUser
};


