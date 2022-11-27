const mysql = require("mysql");
const fs = require("fs");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password : "rootsqlpsw",
  //password: fs.readFileSync("./data/data-base", "utf8"),
  database: "mydb",
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


function addFolder(foldername, username) {
  var sql = 'INSERT INTO folder VALUES ("' + foldername + '","' + username + '")';
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
}

function insertMusicIntoFolder(idMusic, artiste, title, idFolder) {
  var sql = 'INSERT INTO musics VALUES ("' + idMusic + '","' + artiste + '","' + title + '","' + idFolder + '")';
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
}


async function getUserFolders(username) {

  let nb = await getUserNBFolders(username);

  return new Promise(async (resolve, reject) => {
    let folderTab = [];
    console.log("here");
    con.query(
      'SELECT idFOLDER FROM folder WHERE USERNAME = "' + username + '"',
      function (err, result, fields) {
        if (err) reject(err);
        console.log("ici");
        console.log(result);
        console.log(nb);
        for(let i = 0;i < nb ; i++){
          folderTab[i] = result[i].idFOLDER;
          console.log(folderTab[i]);
        }
        resolve(folderTab);
      }
    );
  });
}


async function getUserNBFolders(username) {
  return new Promise(async (resolve, reject) => {
    con.query(
      'SELECT count(*) nb FROM folder WHERE USERNAME = "' + username + '"',
      function (err, result, fields) {
        //console.log(result[1].idFOLDER);
        if (err) reject(err);

        console.log(result[0].nb);
        resolve(result[0].nb);
      }
    );
  });
}


async function getUserFoldersAndMusics(username) {

  let foldersIDS = await getUserFolders(username);

  return new Promise(async (resolve, reject) => {
    con.query(
      'SELECT idmusics, artist, title FROM musics WHERE foldernum = 1',
      function (err, result, fields) {
        console.log(result);
        if (err) reject(err);
        resolve(result);
      }
    );
  });
}

//getUserFoldersAndMusics("test");


module.exports = { getUserInfo, insertUser, alreadyUser, connectionDataBase };

//CREATE TABLE MUSIQUE(id INT PRIMARY KEY NOT NULL,artiste VARCHAR(100),musique VARCHAR(100));
