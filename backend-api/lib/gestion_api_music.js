const axios = require("axios");
// npm install got@11.8.3
const got = require("got");
const cheerio = require("cheerio");
const fs = require("fs");

const searchUrl = "http://api.genius.com/search?q=";
const geniousURL = "http://genius.com";

async function SearchMusicInfo(singer, title) {
  const token = fs.readFileSync("./data/token-genius", "utf8");

  const options = {
    method: "GET",
    url: searchUrl + singer + " " + title,
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  return new Promise((resolve, reject) => {
    axios
      .request(options)
      .then(function (response) {
        resolve({
          id: response.data.response.hits[0].result.id,
          path: response.data.response.hits[0].result.path,
          title: response.data.response.hits[0].result.full_title,
          artist: response.data.response.hits[0].result.artist_names
        });
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

function formateLyrics(codeHtml) {
  const $ = cheerio.load(codeHtml);
  const lyrics = $(".Lyrics__Container-sc-1ynbvzw-6").text();
  return lyrics.split("[").join("\n\n").split("]").join("\n\n");
}

async function GetLyricsByPath(path) {
  return new Promise((resolve, reject) => {
    got(geniousURL + path)
      .then((response) => {
        resolve(formateLyrics(response.body));
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function GetLyrics(singer, title) {
  return new Promise (async (resolve, reject) => {
    try {
      const data = await SearchMusicInfo(singer, title);
      const lyrics = await GetLyricsByPath(data.path);
      resolve(lyrics);
    } catch (error) {
      reject(error);
    }
  });
}

async function GetLyricsWithHole(singer, title) {
  return new Promise (async (resolve, reject) => {
    try {
      const data = await SearchMusicInfo(singer, title);
      const lyrics = await GetLyricsByPath(data.path);
      //code d'etienne
      resolve({
        mots_manquant: ["hey", "test"],
        code_html: "<p>Hello</p>",
        nb_mots_manquant: 2,
        artiste: data.artist,
        musique: data.title,
      });
    } catch (error) {
      reject(error);
    }
  });
}



module.exports = { GetLyrics, GetLyricsWithHole };

