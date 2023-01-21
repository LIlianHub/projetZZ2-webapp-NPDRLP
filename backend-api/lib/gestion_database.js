const mysql = require("mysql");
const fs = require("fs");


// Connection à la base de données

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  //password: fs.readFileSync("./data/data-base", "utf8"),
  password: "rootsqlpsw",
  database: "npdrlp",
});

async function connectionDataBase() {
  return new Promise(async (resolve, reject) => {
    con.connect(function (err) {
      if (err) reject(err);
      resolve("Connecté à la base de données");
    });
  });
}

async function deconnectionDataBase() {
  return new Promise(async (resolve, reject) => {
    con.end(function (err) {
      if (err) reject(err);
      resolve("Deconnecté de la base de données");
      console.log("Deconnecté de la base de données");
    });
  });
}



async function alreadyUser(username) {
  return new Promise(async (resolve, reject) => {
    con.query(
      'SELECT username FROM USER WHERE username = "' + username + '"',
      function (err, result, fields) {
        if (err) {
          throw err;
        }
        if (result[0] == undefined) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    );
  });
}

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

function insertUser(username, pswd) {
  var sql = 'INSERT INTO USER VALUES ("' + username + '","' + pswd + '")';
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
}

// ok avec auto increment
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


// ok
function deleteFolder(idfolder) {
  var sql = 'DELETE FROM FOLDER WHERE idFolder = "' + idfolder + '" ';
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
}



//ok en cascade
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


// MASTERCLASS
async function insertMusicIntoFolder(artiste, title, idFolder) {
  // on verifie qu'on a deja la musique
  let inMus = await alreadyInMusics(title, artiste);

  // si non on l'insere dans music et le folde du user
  if (inMus == null) {
    console.log("jinsere une musique dans music et folder");
    insertMusic(artiste, title);
    let idMusic = await alreadyInMusics(title, artiste);
    insertMusicInFolderWithId(idMusic, idFolder);
  }

  // si oui on verifie si elle est deja dans le folder
  else {
    let inFol = await alreadyInFolder(inMus, idFolder);
    // si non on l'insere dans le folder
    if (inFol) {
      console.log("jinsere une musique dans un dossier");
      insertMusicInFolderWithId(inMus, idFolder);
    }
  }
}


// ok avec auto increment
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



//masterclass
function insertMusicInFolderWithId(idMusic, idFolder) {
  var sql =
    'INSERT INTO MUSIC_IN_FOLDER VALUES ("' + idMusic + '","' + idFolder + '")';
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
}

//ok marche bien (soit null soit l'id de la musique)
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

//ok marche bien + MASTERCLASS
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
          resolve(true);
        } else {
          resolve(false);
        }
      }
    );
  });
}

// magnifique
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

// a tester
async function getFolderForAddMusique(username) {
  return new Promise(async (resolve, reject) => {
    let foldersInfo = await getUserFolders(username);
    let formetted = [];
    for (let i = 0; i < foldersInfo.nb; i++) {
      formetted.push({
        id: foldersInfo.folders[i].id,
        label: foldersInfo.folders[i].name,
        commandId: 'save'
      });
    }
    resolve({ label: "Ajouter à un dossier", items: formetted });
  });
}


// ok marche bien
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

//trop fort
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
          routerLink: "/paroles/" + temp[i].artist + "/" + temp[i].musicName + "/1",
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

// impec
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

/*async function test() {
  await connectionDataBase();
  let test = await getUserFoldersAndMusics("blbl");
  console.log(test);
  console.log(test.allInfo[0]);
  console.log(test.menu[0]);
  await deconnectionDataBase();
}

test();*/


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
};
