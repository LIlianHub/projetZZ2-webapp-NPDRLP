const mysql = require("mysql");
const fs = require("fs");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: fs.readFileSync("./data/data-base", "utf8"),
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

module.exports = { getUserInfo, insertUser, alreadyUser, connectionDataBase };

//CREATE TABLE MUSIQUE(id INT PRIMARY KEY NOT NULL,artiste VARCHAR(100),musique VARCHAR(100));
