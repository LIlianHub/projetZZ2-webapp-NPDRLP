const axios = require("axios");
const fs = require("fs");

// URL utile pour la recherche de vidéo
const searchUrl = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=";


// Token d'authentification pour l'API de Youtube: en général pour le
// lire au démarage du serveur une seule fois
const key = fs.readFileSync("./data/token-youtube", "utf8");



async function SearchVideoUrl(singer, title) {

    // Création de l'objet options pour la requête
    const options = {
        method: "GET",
        url: searchUrl + singer + "+" + title + "+lyrics&key=" + key,
    };
    //console.log("hey: " + options.url);
    return new Promise((resolve, reject) => {
        axios
            .request(options)
            .then(function (response) {
                resolve(response.data.items[0].id.videoId);
                // Recuperation du premier résultat de l'API: résultat le plus pertinent
            })
            .catch(function (error) {
                reject(error);
            });
    });
}

module.exports = { SearchVideoUrl };