const http = require("http");
const listen = require("./lib/listen");
const gestion_database = require("./lib/gestion_database");

main();

async function main() {
  const connexion = await gestion_database.connectionDataBase();
  console.log(connexion);
  console.log("Server is running on port 3000");
  const server = http.createServer(listen);
  server.listen(3000);
}
