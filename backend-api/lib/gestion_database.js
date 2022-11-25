const mysql = require("mysql");
const fs = require("fs");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: fs.readFileSync("./data/data-base", "utf8"),
  database: "mydb",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

  //CREATE TABLE
  /*var sql = "CREATE TABLE USER (username VARCHAR(20) PRIMARY KEY, password VARCHAR(75))";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");
    });*/

  /* DROP TABLE
    var sql = "DROP TABLE customers";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table deleted");
    });*/

  //INSERT VALUE
  /*var sql = "INSERT INTO USER VALUES ('liballejos', 'test')";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });*/

  //SELECT
  /*con.query("SELECT * FROM USER", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });*/
});

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
    console.log("1 record inserted");
  });
}

module.exports = { getUserInfo, insertUser, alreadyUser };
