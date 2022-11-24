const mysql = require("mysql");
const fs = require("fs");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  //quand on reliera au reste
  //password: fs.readFileSync("./data/data-base", "utf8"),
  //temporaire
  password: fs.readFileSync("../data/data-base", "utf8"),
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
    var sql = "DROP TABLE user";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table deleted");
    });*/

  //INSERT VALUE
  /*var sql = "INSERT INTO USER VALUES ('etcharpin', 'test')";
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



function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function alreadyUser(username) {
  return new Promise(async (resolve, reject) => {
    con.query(
      'SELECT username FROM USER WHERE username = "' + username + '"',
      function (err, result, fields) {
        if (err) {
          reject(err);
        }
        if (result == "") {
          resolve(false);
        } else {
          resolve(true);
        }
      }
    );
  });
}

async function callAlreadyUser(username) {
  await delay(1000);
  retour = await alreadyUser(username);
  console.log(retour);
}

callAlreadyUser("etcharpin");
//insertUser("hudenizot","jaimelesfrites");
//getUser("hudenizot");

  async function getUser(username){

    let userInfo;
    userInfo = getUserInfo(username);

  }

  function getUserInfo(username){

    let userInfo = {
      username: "",
      pswd : ""
    };

    con.query(
      'SELECT * FROM USER WHERE username = "' + username + '"',
     function (err, result, fields) {
      if (err) throw err;
      userInfo.username =  result[0].username;
      userInfo.pswd =  result[0].password;

      console.log(userInfo);
    });
    

    //recup toutes les info
    return userInfo;

  }


function insertUser(username,pswd){

  var sql = 'INSERT INTO user VALUES ("' + username +'","' + pswd + '")';
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });

}
