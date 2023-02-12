const mysql = require("mysql");
const fs = require("fs");



//alerte pour ajouter que une fois
//suppr les deux

// en general pour le lire au démarage du serveur
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootsqlpsw",
  database: "npdrlp",
});

// connection a la base de données
async function connectionDataBase() {
  return new Promise(async (resolve, reject) => {
    con.connect(function (err) {
      if (err) reject(err);
      resolve("Connecté à la base de données");
    });
  });
}

// deconnection de la base de données
async function deconnectionDataBase() {
  return new Promise(async (resolve, reject) => {
    con.end(function (err) {
      if (err) reject(err);
      resolve("Deconnecté de la base de données");
      console.log("Deconnecté de la base de données");
    });
  });
}


// verifie si l'id utilisateur entrée existe dans la base de données
// renvoie true si l'utilisateur existe
// renvoie false si l'utilisateur n'existe pas
async function alreadyUser(username) {
  return new Promise(async (resolve, reject) => {
    con.query(
      'SELECT username FROM USER WHERE username = "' + username + '"',
      function (err, result, fields) {
        if (err) {
          throw err;
        }
        if (result[0] == undefined) {
          resolve(false);
        } else {
          resolve(true);
        }
      }
    );
  });
}


// recupere les informations d'un utilisateur
// renvoie un objet avec les informations de l'utilisateur
// {username: "username", password: "password"}
async function getUserInfo(username) {
  return new Promise(async (resolve, reject) => {
    let userInfo = {
      username: "",
      password: "",
    };
    con.query(
      'SELECT * FROM USER WHERE username = "' + username + '"',
      function (err, result, fields) {
        if (err) reject(err);
        userInfo.username = result[0].username;
        userInfo.password = result[0].password;
        resolve(userInfo);
      }
    );
  });
}

// ajoute un utilisateur dans la base de données
// en asynchrone
function insertUser(username, pswd) {
  var sql = 'INSERT INTO USER VALUES ("' + username + '","' + pswd + '")';
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
}

/// ajoute un dossier dans la base de données
// en asynchrone
function addFolder(folderName, username) {
  var sql =
    'INSERT INTO FOLDER (folderName, idUser) VALUES ("' +
    folderName +
    '","' +
    username +
    '")';
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
}


// supprime un dossier de la base de données
// en asynchrone
function deleteFolder(idfolder) {
  var sql = 'DELETE FROM FOLDER WHERE idFolder = "' + idfolder + '" ';
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
}


// supprime une musique d'un dossier de la base de données
// en asynchrone
function deleteMusicFromFolder(idMusic, idfolder) {
  var sql =
    "DELETE FROM MUSIC_IN_FOLDER WHERE idFolder = " +
    idfolder +
    " and idMusic =" +
    idMusic +
    "";
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
}


// ajoute une musique d'un dossier de la base de données
// Verifie si la musique existe deja dans le dossier et dans la base de données
// utilise alreadyInMusics et alreadyInFolder
// utilise insertMusicInFolderWithId, insertMusicInFolderWithId et insertMusic
// en asynchrone
async function insertMusicIntoFolder(artiste, title, idFolder) {
  // on verifie qu'on a deja la musique
  let inMus = await alreadyInMusics(title, artiste);

  // si non on l'insere dans music et le folder du user
  if (inMus == null) {
    //console.log("jinsere une musique dans music et folder");
    insertMusic(artiste, title);
    let idMusic = await alreadyInMusics(title, artiste);
    insertMusicInFolderWithId(idMusic, idFolder);
  }

  // si oui on verifie si elle est deja dans le folder
  else {
    let inFol = await alreadyInFolder(inMus, idFolder);
    // si non on l'insere dans le folder
    if (!inFol) {
      //console.log("jinsere une musique dans un dossier");
      insertMusicInFolderWithId(inMus, idFolder);
    }
  }
}


// ajoute une musique dans la base de données
// en asynchrone
function insertMusic(artiste, title) {
  var sql =
    'INSERT INTO MUSIC (artist, musicName) VALUES ("' +
    artiste +
    '","' +
    title +
    '")';
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
}


// ajoute une musique dans un dossier de la base de données
// en asynchrone
function insertMusicInFolderWithId(idMusic, idFolder) {
  var sql =
    'INSERT INTO MUSIC_IN_FOLDER VALUES ("' + idMusic + '","' + idFolder + '")';
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
}

// Verifie si la musique est deja ou non dans la base de données
// Si oui, renvoie l'id de la musique
// sinon renvoie null
async function alreadyInMusics(musicName, musicArtist) {
  return new Promise(async (resolve, reject) => {
    con.query(
      'SELECT idMusic FROM MUSIC WHERE musicName = "' +
      musicName +
      '" AND artist = "' +
      musicArtist +
      '"',
      function (err, result, fields) {
        if (err) {
          throw err;
        }
        if (result[0] == undefined) {
          resolve(null);
        } else {
          resolve(result[0].idMusic);
        }
      }
    );
  });
}

// Verifie si la musique est deja ou non dans le dossier
// Si oui, renvoie true
// sinon renvoie false
async function alreadyInFolder(idMusic, idfolder) {
  return new Promise(async (resolve, reject) => {
    con.query(
      "SELECT idMusic FROM MUSIC_IN_FOLDER WHERE idMusic = " +
      idMusic +
      " AND idFolder = " +
      idfolder +
      "",
      function (err, result, fields) {
        if (result[0] == undefined) {
          resolve(false);
        } else {
          resolve(true);
        }
      }
    );
  });
}

// renvoie les dossier d'un utilisateur
async function getUserFolders(username) {
  return new Promise(async (resolve, reject) => {
    let nb = await getUserNBFolders(username);
    let folderTab = [];
    con.query(
      'SELECT idFolder, folderName FROM FOLDER WHERE idUser = "' +
      username +
      '"',
      function (err, result, fields) {
        if (err) throw err;
        for (let i = 0; i < nb; i++) {
          folderTab.push({ "id": result[i].idFolder, "name": result[i].folderName });
        }
        resolve({ "nb": nb, "folders": folderTab });
      }
    );
  });
}

// renvoie un objet qui sera transformé dans le front en
// menu pour ajouter des musiques à un dossier
async function getFolderForAddMusique(username) {
  return new Promise(async (resolve, reject) => {
    let foldersInfo = await getUserFolders(username);
    let formetted = [];
    for (let i = 0; i < foldersInfo.nb; i++) {
      formetted.push({
        id: foldersInfo.folders[i].id,
        label: foldersInfo.folders[i].name,
      });
    }
    resolve({ label: "Ajouter à un dossier", items: formetted });
  });
}


// renvoie le nombre de dossier d'un utilisateur
async function getUserNBFolders(username) {
  return new Promise(async (resolve, reject) => {
    con.query(
      'SELECT count(*) nb FROM FOLDER WHERE idUser = "' + username + '"',
      function (err, result, fields) {
        if (err) throw err;
        resolve(result[0].nb);
      }
    );
  });
}

// renvoie les dossier d'un utilisateur avec toutes les musiques de chaque dossier
async function getUserFoldersAndMusics(username) {
  return new Promise(async (resolve, reject) => {
    let foldersInfo = await getUserFolders(username);
    let pourMenuNg = [];
    let temp = [];
    let temp_format = [];

    for (let j = 0; j < foldersInfo.nb; j++) {
      temp = await getmusicFromFolderId(foldersInfo.folders[j].id);

      temp_format = [];
      for (let i = 0; i < temp.length; i++) {
        temp_format.push({
          label: temp[i].musicName + " - " + temp[i].artist,
          routerLink: "/paroles/" + temp[i].musicName + "/ ",
          id: temp[i].idMusic,
        });
      }
      pourMenuNg.push({
        label: foldersInfo.folders[j].name,
        items: temp_format,
        id: foldersInfo.folders[j].id,
      });
    }
    resolve(pourMenuNg);
  });
}


// Recupere toutes les musiques d'un folder avec son id
async function getmusicFromFolderId(idFolder) {
  return new Promise(async (resolve, reject) => {
    con.query(
      'SELECT artist, musicName, m.idMusic FROM MUSIC m, MUSIC_IN_FOLDER mf WHERE mf.idFolder = "' +
      idFolder +
      '" AND m.idMusic = mf.idMusic',
      function (err, result, fields) {
        if (err) throw err;
        resolve(result);
      }
    );
  });
}

// Verifie si un folder appartient bien a un utilisateur
async function verifFolderUser(username, idFolder) {
  return new Promise(async (resolve, reject) => {
    con.query(
      'SELECT idUser FROM FOLDER WHERE idUser = "' + username + '" AND idFolder = "' + idFolder + '"',
      function (err, result, fields) {
        if (err) {
          throw err;
        }
        if (result[0] == undefined) {
          reject("Ce dossier ne vous appartient pas !");
        } else {
          resolve(true);
        }
      }
    );
  });
}


function renameFolder(idFolder, newName) {
  var sql =
    'UPDATE FOLDER SET folderName = "' + newName + '" WHERE idFolder = "' + idFolder + '"';
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
}




/*async function test() {
  await connectionDataBase();
  renameFolder(4, "test");
  await deconnectionDataBase();
}

test();*/
//addFolder("pitie","etcharpin");

module.exports = {
  getUserInfo,
  insertUser,
  alreadyUser,
  connectionDataBase,
  getUserFoldersAndMusics,
  insertMusicIntoFolder,
  addFolder,
  deleteFolder,
  deleteMusicFromFolder,
  getFolderForAddMusique,
  verifFolderUser,
  renameFolder
};
