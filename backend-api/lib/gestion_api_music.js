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
  return lyrics.split("[").join("<br><br>").split("]").join("<br><br>");
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
      let motDisparu = [];
      let html;
      let nbmotenmoins = 0 ;
      let j = 0;
      //code d'etienne
      const splitLyrics = lyrics.split(' ');
      console.log(splitLyrics);
      console.log(lyrics);
      console.log(splitLyrics.length);
      for(let i = 0; i< splitLyrics.length;i++)
			{
				let rdm = Math.floor(Math.random() * 10);
				if(rdm < 9){
					html += splitLyrics[i] + "  ";
				}
				else{
					motDisparu[j] = splitLyrics[i];
				
					html += '<input name="form_'+ j.toString() +'" type="text"  class="form-control" placeholder="' + splitLyrics[i].length.toString() + ' lettres " formControlName="form_' + j.toString() + '" size="' + splitLyrics[i].length.toString() + '">'
					html +="  ";
					j++;
          nbmotenmoins++;
				}
				
			}

     


      resolve({
        mots_manquant: motDisparu,
        code_html: html,
        nb_mots_manquant: nbmotenmoins,
        artiste: data.artist,
        musique: data.title,
      });
    } catch (error) {
      reject(error);
    }
  });
}




module.exports = { GetLyrics, GetLyricsWithHole };

