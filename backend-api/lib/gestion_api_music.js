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
  const lyrics = $(".Lyrics__Container-sc-1ynbvzw-6").html();
  const test = lyrics.replace(/<br>/g, "\n");
  
  const lyricsFormated = test.replace(/<.*?>/g, "");
  const facile = lyricsFormated.replace(/\n/g, " <br> ");
  let mab = facile.replace(/\[.*?\]/g, " ");
  mab = mab.replace(/\(/g, "( ");
  mab = mab.replace(/\)/g, " )");
  mab = mab.replace(/,/g, " ,");

  return mab;
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
  let motDisparu = [];
  let html;
  let nbmotenmoins = 0;
  let j = 0;

  const splitLyrics = lyrics.split(" ");
  switch (difficulty) {
    case "1":
      for (let i = 0; i < splitLyrics.length; i++) {
        html += splitLyrics[i] + "  ";
      }
      break;

    case "2":
      for (let i = 0; i < splitLyrics.length; i++) {
        let rdm = Math.floor(Math.random() * 10);
        if (rdm < 9) {
          html += splitLyrics[i] + "  ";
        } else {
            if(splitLyrics[i] == "," || splitLyrics[i] == ")" || splitLyrics[i] == "(" || splitLyrics[i] == "!" || splitLyrics[i] == "?" || splitLyrics[i] == "-" || splitLyrics[i] == "<br>" || splitLyrics[i] == ""){
              html += splitLyrics[i] + "  ";
            }
            else{
              motDisparu[j] = splitLyrics[i].toUpperCase();

              html +=
                '<input name="form_' +
                j.toString() +
                '" type="text"  class="form-control" maxlength="' +
                splitLyrics[i].length.toString() +
                '" placeholder="' +
                splitLyrics[i].length.toString() +
                ' lettres " formControlName="form_' +
                j.toString() +
                '" size="' +
                splitLyrics[i].length.toString() +
                '">';
              html += "  ";
              j++;
              nbmotenmoins++;
            }

        }
      }
      break;

    case "3":
      for (let i = 0; i < splitLyrics.length; i++) {
        let rdm = Math.floor(Math.random() * 10);
        if (rdm < 7) {
          html += splitLyrics[i] + "  ";
        } else {
          motDisparu[j] = splitLyrics[i].toUpperCase();

          html +=
            '<input name="form_' +
            j.toString() +
            '" type="text"  class="form-control" maxlength="' +
            splitLyrics[i].length.toString() +
            '" placeholder="' +
            splitLyrics[i].length.toString() +
            ' lettres " formControlName="form_' +
            j.toString() +
            '" size="' +
            splitLyrics[i].length.toString() +
            '">';
          html += "  ";
          j++;
          nbmotenmoins++;
        }
      }
      break;

    case "4":
      for (let i = 0; i < splitLyrics.length; i++) {
        let rdm = Math.floor(Math.random() * 10);
        if (rdm < 9) {
          html += splitLyrics[i] + "  ";
        } else {
          motDisparu[j] = splitLyrics[i].toUpperCase();

          html +=
            '<input name="form_' +
            j.toString() +
            '" type="text"  class="form-control"  formControlName="form_' +
            j.toString() +
            '" size="' +
            splitLyrics[i].length.toString() +
            '">';
          html += "  ";
          j++;
          nbmotenmoins++;
        }
      }
      break;

    case "5":
      break;

    default:
      break;
  }
  console.log(motDisparu);
  const tab = [motDisparu, html, nbmotenmoins];
  return tab;
}

async function GetLyricsWithHole(singer, title, difficulty) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await SearchMusicInfo(singer, title);
      const lyrics = await GetLyricsByPath(data.path);
      let tab = placeHoles(difficulty, lyrics);

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
