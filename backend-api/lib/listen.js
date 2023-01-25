/*Module*/
const express = require("express");
var cors = require("cors");

/*Mes modules*/
const gestion_api_music = require("./gestion_api_music");
const gestion_user = require("./gestion_user");
const gestion_music_user = require("./gestion_music_user");

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

// renvoie les paroles d'une musique en fonction de son artiste et de son titre
listen.get("/lyricsGestion/getLyrics/:singer-:song", async function (req, res) {
  if (req.params.singer && req.params.song) {
    try {
      const data = await gestion_api_music.GetLyrics(
        req.params.singer,
        req.params.song
      );
      res.status(200).json({ paroles: data });
    } catch (error) {
      console.log("here");
      res.status(400).send("Erreur lors de la recupération de la musique");
    }
  } else {
    res.status(400).send("Not enough parameters");
  }
});

// renvoie les paroles d'une musique en fonction de son artiste et de son titre
// avec des trous
listen.get(
  "/lyricsGestion/getsLyricsWithHole/:singer-:song-:difficulty",
  async function (req, res) {
    if (req.params.singer && req.params.song && req.params.difficulty) {
      try {
        const data = await gestion_api_music.GetLyricsWithHole(
          req.params.singer,
          req.params.song,
          req.params.difficulty
        );
        res.status(200).send(data);
      } catch (error) {
        res.status(500).send("Erreur lors de la recupération de la musique");
      }
    } else {
      res.status(400).send("Not enough parameters");
    }
  }
);


// Recupere les dossiers pour ajouter une musique
listen.get("/lyricsGestion/getFolderForAddMusique", async (req, res) => {
  try {
    let user = await gestion_user.verifyToken(req.headers["x-access-token"]);
    let retour = await gestion_music_user.folderMenuForAddMusic(user);
    res.status(200).send(retour);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Recupere les dossiers et les musiques dedans
listen.get("/lyricsGestion/getUserMusicFolder", async (req, res) => {
  try {
    let user = await gestion_user.verifyToken(req.headers["x-access-token"]);
    let retour = await gestion_music_user.getFoldersUser(user);
    res.status(200).json(retour);
  } catch (err) {
    res.status(400).send(err);
  }
});


// Ajoute une musique dans un dossier
listen.post("/lyricsGestion/addUserMusicInFolder", async (req, res) => {
  if (req.body.folder && req.body.title && req.body.artist) {
    try {
      let retour = await gestion_music_user.addMusicInFolderUser(
        req.body.folder,
        req.body.title,
        req.body.artist,
        req.headers["x-access-token"]
      );
      res.status(200).json({
        message: retour,
      });
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    res.status(400).send("Not enough parameters");
  }
});

// supprime une musique d'un dossier à l'aide de son id, de l'id du dossier
// et du token du user
listen.post("/lyricsGestion/deleteMusicInFolder", async (req, res) => {
  if (req.body.idFolder, req.body.idMusic) {
    try {
      let retour = await gestion_music_user.deleteMusicInFolderUser(
        req.body.idFolder,
        req.body.idMusic,
        req.headers["x-access-token"]
      );
      res.status(200).json({
        message: retour,
      });
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    res.status(400).send("Not enough parameters");
  }
});


// Ajoute un dossier à un user
listen.post("/lyricsGestion/addUserFolder", async (req, res) => {
  if (req.body.folderName) {
    try {
      let retour = await gestion_music_user.addFolderUser(
        req.body.folderName,
        req.headers["x-access-token"]
      );
      res.status(200).json({
        message: retour,
      });
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    res.status(400).send("Not enough parameters");
  }
});

// supprime un dossier à l'aide de son id et du token du user
listen.post("/lyricsGestion/deleteUserFolder", async (req, res) => {
  if (req.body.idFolder) {
    try {
      let retour = await gestion_music_user.deleteFolderUser(
        req.body.idFolder,
        req.headers["x-access-token"]
      );
      res.status(200).json({
        message: retour,
      });
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    res.status(400).send("Not enough parameters");
  }
});


// renomme un dossier d'un user
listen.post("/lyricsGestion/renameFolder", async (req, res) => {
  if (req.body.idFolder, req.body.newName) {
    try {
      let retour = await gestion_music_user.renameFolderUser(
        req.body.idFolder,
        req.body.newName,
        req.headers["x-access-token"]
      );
      res.status(200).json({
        message: retour,
      });
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    res.status(400).send("Not enough parameters");
  }
});


/*Requete user*/

// Inscription
listen.post("/userGestion/register", async (req, res) => {
  if (req.body.username && req.body.password) {
    try {
      let retour = await gestion_user.register(
        req.body.username,
        req.body.password
      );
      res.status(200).json({
        message: retour,
      });
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    res.status(400).send("Not enough parameters");
  }
});


// Connexion
listen.post("/userGestion/login", async (req, res) => {
  if (req.body.username && req.body.password) {
    try {
      let retour = await gestion_user.login(
        req.body.username,
        req.body.password
      );
      res.status(200).json(retour);
    } catch (err) {
      res.status(400).send(err);
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
