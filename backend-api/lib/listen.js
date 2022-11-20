/*Module*/
const express = require("express");
var cors = require("cors");

/*Mes modules*/
const gestion_api_music = require("./gestion_api_music");

/*creation app express*/
const listen = express();

/*Gestion requete externe*/
var corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 200, // For legacy browser support
};
listen.use(cors(corsOptions));

/*Lire contenu json des requetes recu*/
listen.use(express.urlencoded({ extended: true }));
listen.use(express.json());

/*Requete parole*/
listen.get("/getLyrics/:singer-:song", async function (req, res) {
  if (req.params.singer && req.params.song) {
    try{
      const data = await gestion_api_music.GetLyrics(
        req.params.singer,
        req.params.song
      );
      res.status(200).json({ paroles: data });
    }
    catch(error){
      res.status(500).send("Erreur lors de la recupération de la musique");
    }
  } else {
    res.status(400).send("Not enough parameters");
  }
});

listen.get("/getsLyricsWithHole/:singer-:song-:difficulty", async function (req, res) {
  if (req.params.singer && req.params.song && req.params.difficulty) {
    try{
      const data = await gestion_api_music.GetLyricsWithHole(
        req.params.singer,
        req.params.song,
        req.params.difficulty
      );
      res.status(200).send(data);
    }
    catch(error){
      res.status(500).send("Erreur lors de la recupération de la musique");
    }
  } else {
    res.status(400).send("Not enough parameters");
  }
});


/*gestion autres requetes*/
listen.use(function (req, res, next) {
  res.status(404).send("Nothing Here");
});

listen;

module.exports = listen;
