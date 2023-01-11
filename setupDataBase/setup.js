const mysql = require("mysql");

// En premier temps faire : CREATE DATABASE npdrlp;

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


async function main(){
    await connectionDataBase();
    connsole.log("Configuration en cours ...")
    
    await deconnectionDataBase();
    console.log("Configuration Terminée !");
}


main();