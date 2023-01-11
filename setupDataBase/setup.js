const mysql = require("mysql");

// En premier temps faire : CREATE DATABASE npdrlp;

/*
CREATE TABLE `USER` (
	`username` VARCHAR(128) NOT NULL,
	`password` VARCHAR(512) NOT NULL,
	PRIMARY KEY (`username`)
);

CREATE TABLE `FOLDER` (
	`idFolder` int NOT NULL AUTO_INCREMENT,
  `folderName` VARCHAR(128) NOT NULL,
	`idUser` VARCHAR(512) NOT NULL,
	PRIMARY KEY (`idFolder`),
    FOREIGN KEY (`idUser`) REFERENCES USER(`username`)
);

CREATE TABLE `MUSIC` (
	`idMusic` int NOT NULL AUTO_INCREMENT,
	`artist` VARCHAR(128) NOT NULL,
	`musicName` VARCHAR(128) NOT NULL,
	PRIMARY KEY (`idMusic`)
);

CREATE TABLE `MUSIC_IN_FOLDER` (
	`idMusic` int NOT NULL,
	`idFolder` int NOT NULL,
	PRIMARY KEY (`idMusic`,`idFolder`),
    FOREIGN KEY (`idMusic`) REFERENCES MUSIC(`idMusic`),
    FOREIGN KEY (`idFolder`) REFERENCES FOLDER(`idFolder`)
);
*/

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootsqlpsw",
  database: "npdrlp",
});

async function connectionDataBase() {
  return new Promise(async (resolve, reject) => {
    con.connect(function (err) {
      if (err) reject(err);
      resolve("Connecté à la base de données");
      console.log("Connecté à la base de données");
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

async function addUserTable() {
  return new Promise(async (resolve, reject) => {
    con.query(
      "CREATE TABLE `USER` ( `username` VARCHAR(128) NOT NULL, `password` VARCHAR(512) NOT NULL, PRIMARY KEY (`username`) );",
      function (err, result) {
        if (err) reject(err);
        resolve("Table USER créée");
        console.log("Table USER créée");
      }
    );
  });
}

async function addFolderTable() {
  return new Promise(async (resolve, reject) => {
    con.query(
      "CREATE TABLE `FOLDER` ( `idFolder` int NOT NULL AUTO_INCREMENT, `folderName` VARCHAR(128) NOT NULL, `idUser` VARCHAR(512) NOT NULL, PRIMARY KEY (`idFolder`), FOREIGN KEY (`idUser`) REFERENCES USER(`username`) );",
      function (err, result) {
        if (err) reject(err);
        resolve("Table FOLDER créée");
        console.log("Table FOLDER créée");
      }
    );
  });
}

async function addMusicTable() {
  return new Promise(async (resolve, reject) => {
    con.query(
      "CREATE TABLE `MUSIC` ( `idMusic` int NOT NULL AUTO_INCREMENT, `artist` VARCHAR(128) NOT NULL, `musicName` VARCHAR(128) NOT NULL, PRIMARY KEY (`idMusic`) );",
      function (err, result) {
        if (err) reject(err);
        resolve("Table MUSIC créée");
        console.log("Table MUSIC créée");
      }
    );
  });
}

async function addMusicInFolderTable() {
  return new Promise(async (resolve, reject) => {
    con.query(
      "CREATE TABLE `MUSIC_IN_FOLDER` ( `idMusic` int NOT NULL, `idFolder` int NOT NULL, PRIMARY KEY (`idMusic`,`idFolder`), FOREIGN KEY (`idMusic`) REFERENCES MUSIC(`idMusic`), FOREIGN KEY (`idFolder`) REFERENCES FOLDER(`idFolder`));",
      function (err, result) {
        if (err) reject(err);
        resolve("Table MUSIC_IN_FOLDER créée");
        console.log("Table MUSIC_IN_FOLDER créée");
      }
    );
  });
}

async function main() {
  await connectionDataBase();
  console.log("Configuration en cours ...");
  await addUserTable();
  await addFolderTable();
  await addMusicTable();
  await addMusicInFolderTable();
  await deconnectionDataBase();
  console.log("Configuration Terminée !");
}

main();
