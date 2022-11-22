const axios = require("axios");
// npm install got@11.8.3
const got = require("got");
const cheerio = require("cheerio");
const fs = require("fs");
const { join } = require("path");

const searchUrl = "http://api.genius.com/search?q=";
const geniousURL = "http://genius.com";

const banChar = [",", ")", "(", "!", "?", "-", "<br>", "", ":", '"'];

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
          artist: response.data.response.hits[0].result.artist_names,
        });
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

function formateLyrics(codeHtml) {
  const $ = cheerio.load(codeHtml);
  let lyrics = "";
  $(".Lyrics__Container-sc-1ynbvzw-6").each(function (index, item) {
    lyrics += $(this).html();
  });

  let formated = lyrics
    .replace(/<br>/g, "\n")
    .replace(/<.*?>/g, "")
    .replace(/\n/g, " <br> ")
    .replace(/\[.*?\]/g, " ")
    .replace(/\(/g, "( ")
    .replace(/\)/g, " )")
    .replace(/,/g, " ,")
    .replace(/\"/g, ' " ');

  return formated;
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
  return new Promise(async (resolve, reject) => {
    try {
      const data = await SearchMusicInfo(singer, title);
      const lyrics = await GetLyricsByPath(data.path);
      resolve(lyrics);
    } catch (error) {
      reject(error);
    }
  });
}

function placeHoles(difficulty, lyrics) {
  let tab;

  switch (difficulty) {
    case "1":
      tab = [[], lyrics, 0];
      break;

    case "2":
      tab = placeHolesDiffficultyRandom(lyrics, 9, true);
      break;

    case "3":
      tab = placeHolesDiffficultyRandom(lyrics, 7, true);
      break;

    case "4":
      tab = placeHolesDiffficultyRandom(lyrics, 9, false);
      break;

    default:
      break;
  }
  return tab;
}

function placeHolesDiffficultyRandom(lyrics, random, withHint) {
  const splitLyrics = lyrics.split(" ");
  let motDisparu = [];
  let html = "";
  let nbmotenmoins = 0;
  let j = 0;
  for (let i = 1; i < splitLyrics.length; i++) {
    let rdm = Math.floor(Math.random() * 10);
    if (rdm < random) {
      html += splitLyrics[i] + "  ";
    } else {
      if (banChar.indexOf(splitLyrics[i]) != -1) {
        html += splitLyrics[i] + "  ";
      } else {
        motDisparu[j] = splitLyrics[i].toUpperCase();

        html +=
          '<input name="form_' +
          j.toString() +
          '" type="text"  class="form-contplaceHolesDiffficulty1rol" maxlength="' +
          splitLyrics[i].length.toString() +
          '" formControlName="form_' +
          j.toString() +
          '" size="' +
          splitLyrics[i].length.toString();

        if (withHint) {
          html +=
            '" placeholder="' +
            splitLyrics[i].length.toString() +
            ' lettres ">';
        } else {
          html += '">';
        }

        html += "  ";
        j++;
        nbmotenmoins++;
      }
    }
  }
  return [motDisparu, html, nbmotenmoins];
}

async function GetLyricsWithHole(singer, title, difficulty) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await SearchMusicInfo(singer, title);
      const lyrics = await GetLyricsByPath(data.path);

      let tab = placeHoles(difficulty, lyrics);
      console.log(tab);

      resolve({
        mots_manquant: tab[0],
        code_html: tab[1],
        nb_mots_manquant: tab[2],
        artiste: data.artist,
        musique: data.title,
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { GetLyrics, GetLyricsWithHole };
