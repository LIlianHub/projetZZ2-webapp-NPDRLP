const mysql = require("mysql");
const fs = require("fs");

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

function addFolder(folderId, folderName, username) {
  var sql =
    'INSERT INTO FOLDER VALUES ("' +
    folderId +
    '","' +
    folderName +
    '","' +
    username +
    '")';
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
}

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

async function insertMusicIntoFolder(idMusic, artiste, title, idFolder) {
  let inMus = await alreadyInMusics(idMusic);
  let inFol = await alreadyInFolder(idMusic, idFolder);

  if (inMus) {
    console.log("jinsere une musique");
    insertMusic(idMusic, artiste, title);
  }
  if (inFol) {
    console.log("jinsere une musique dans un dossier");
    insertMusInFo(idMusic, idFolder);
  }
}
//ok
function insertMusic(idMusic, artiste, title) {
  var sql =
    'INSERT INTO MUSIC VALUES ("' +
    idMusic +
    '","' +
    artiste +
    '","' +
    title +
    '")';
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
}
//ok
function insertMusInFo(idMusic, idFolder) {
  var sql =
    'INSERT INTO MUSIC_IN_FOLDER VALUES ("' + idMusic + '","' + idFolder + '")';
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
}

//ok
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
          resolve(true);
        } else {
          resolve(false);
        }
      }
    );
  });
}

//ok
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
          folderTab[i + 1] = result[i].idFOLDER;
          folderTab[nb + i + 1] = result[i].FOLDERname;
        }
        folderTab[0] = nb;
        resolve(folderTab);
      }
    );
  });
}

async function getUserNBFolders(username) {
  return new Promise(async (resolve, reject) => {
    con.query(
      'SELECT count(*) nb FROM folder WHERE idUser = "' + username + '"',
      function (err, result, fields) {
        if (err) throw err;
        resolve(result[0].nb);
      }
    );
  });
}

async function getUserFoldersAndMusics(username) {
  return new Promise(async (resolve, reject) => {
    let foldersIDS = await getUserFolders(username);
    let dossier = [];
    let temp = [];
    let temp_format = [];
    for (let j = 1; j <= foldersIDS[0]; j++) {
      temp = await getmusicFromFolderNum(foldersIDS[j]);
      temp_format = [];
      for (let i = 0; i < temp.length; i++) {
        temp_format.push({
          label: temp[i].title + " - " + temp[i].artist,
          routerLink: "/paroles/" + temp[i].artist + "/" + temp[i].title + "/1",
        });
      }
      dossier.push({
        label: foldersIDS[foldersIDS[0] + j],
        items: temp_format,
      });
    }
    resolve(dossier);
  });
}

async function getmusicFromFolderNum(idFolder) {
  return new Promise(async (resolve, reject) => {
    con.query(
      'SELECT artist, musicName FROM MUSIC m, MUSIC_IN_FOLDER mf WHERE mf.idFolder = "' +
        idFolder +
        '" AND m.idMusic = mf.idMusic',
      function (err, result, fields) {
        if (err) throw err;
        resolve(result);
      }
    );
  });
}

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
};
