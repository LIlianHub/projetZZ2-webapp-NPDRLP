var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

function register(username, password) {
  //appel base de donnée pour vérifier si le username existe déjà (fonction existUser() dans gestion database)
    //si oui, renvoyer un message d'erreur

    //si non
  let hashedPassword = bcrypt.hashSync(password, 8);
  //ajout dans base de donnée

}

function login(username, password) {
    //on essaye de récupérer l'utilisateur dans la base de donnée
    //si on ne le trouve pas, on renvoie un message d'erreur
    //si il existe, on vérifie le mot de passe
    bcrypt.compareSync(password, hash /*recuperé dans la base de donnée*/); // true
    //si le mot de passe est bon, on renvoie un token et le username

    //sinon on renvoie un message d'erreur
}