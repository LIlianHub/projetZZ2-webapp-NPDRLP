const gestion_database = require("./gestion_database");
const gestion_user = require("./gestion_user");

async function getFoldersUser(username) {
  return new Promise(async (resolve, reject) => {
    resolve(await gestion_database.getUserFoldersAndMusics(username));
  });
}

async function deleteFolderUser(folder, token) {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await gestion_user.verifyToken(token);
      //verifier si personne a le droit
      gestion_database.deleteFolder(folder);
      resolve(retour);
    } catch (err) {
      reject(err);
    }
  });
}

async function addFolderUser(folder, token) {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await gestion_user.verifyToken(token);
      //verifier si personne a le droit
      gestion_database.addFolder(folder);
      resolve(retour);
    } catch (err) {
      reject(err);
    }
  });
}

//penser a trouver comment gerer idmusic
async function addMusicInFolderUser(folder, title, artist, token) {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await gestion_user.verifyToken(token);
      //verifier si personne a le droit
      gestion_database.insertMusicIntoFolder(idmusic, artist, title, folder);
      resolve("Musique bien ajoutée");
    } catch (err) {
      reject(err);
    }
  });
}

async function deleteMusicInFolderUser(idFolder, idMusic, token) {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await gestion_user.verifyToken(token);
      //verifier si personne a le droit
      gestion_database.deleteMusicFromFolder(idMusic, idFolder);
      resolve(retour);
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
};



/*CREATE TABLE musicsinfolder( idMusic INT NOT NULL, idFolder INT NOT NULL,  FOREIGN KEY (idMusic) REFERENCES musics (idmusics), FOREIGN KEY (idFolder) REFERENCES folder (idFOLDER), PRIMARY KEY (idMusic, idFolder));

CREATE TABLE musics(idmusics INT NOT NULL, artist  varchar(45) NOT NULL, title varchar(45) NOT NULL, PRIMARY KEY (idmusics));*/