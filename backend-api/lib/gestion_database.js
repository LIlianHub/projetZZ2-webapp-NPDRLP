var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootsqlpsw",
  database: "mydb",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

  //CREATE TABLE
  /*var sql = "CREATE TABLE USER (username VARCHAR(20) PRIMARY KEY, password VARCHAR(20))";
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
  con.query("SELECT * FROM USER", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
      });
});
