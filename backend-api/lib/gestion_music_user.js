const gestion_database = require("./gestion_database");

async function saveMusic(artiste, musique) {
  return new Promise(async (resolve, reject) => {});
}

async function getFoldersUser(username) {
  return new Promise(async (resolve, reject) => {
    resolve(await gestion_database.getUserFoldersAndMusics(username));
  });
}

module.exports = { getFoldersUser };
