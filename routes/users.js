var express = require("express");
var router = express.Router();
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");

//import du module uid2 pour pouvoir créer un token
const uid2 = require("uid2");
//import du module bcrypt pour pouvoir mettre en place une mécanique de mot de passe
const bcrypt = require("bcrypt");
//créer un nouveau user
router.post("/signup", (req, res) => {
  // regex pour mail
  const EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  //créer une regex pour gérer la casse
  let userQuery = new RegExp(req.body.username, "i");

  let passwordQuery = req.body.password;

  // utiliser le module checkBody pour gérer les champs vides
  if (!checkBody(req.body, ["email", "username", "password"])) {
    res.json({ result: false, error: "Missing or empty filed" });
    return;
  }

  User.findOne({ username: userQuery }).then((data) => {
    // console.log(data);

    if (data) {
      //Si un utilisateur existe déjà, pas de création
      res.json({
        result: false,
        error: "User already registered",
        source: "user",
      });
    } else {
      if (EMAIL_REGEX.test(req.body.email)) {
        //Mettre en place une mécanique de hachage du mot de passe (haché 10x)
        const hash = bcrypt.hashSync(passwordQuery, 10);
        if (EMAIL_REGEX.test(req.body.email)) {
          //Créer un nouvel utilisateur avec un token de 32 charactères
          const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            token: uid2(32),
          });

          newUser.save().then((newDoc) => {
            //Renvoyer le token du nouvel utilisateur
            res.json({ result: true, token: newDoc.token });
          });
        }
      } else {
        res.json({ result: false, user: "email ivalid", source: "email" });
      }
    }
  });
});

//Se connecter à un compte utilisateur
router.post("/signin", (req, res) => {
  console.log(req.body);

  //créer une regex pour gérer la casse
  let userQuery = new RegExp(req.body.username, "i");
  let passwordQuery = req.body.password;

  //utiliser le module checkBody pour gérer les champs vides
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ username: userQuery }).then((data) => {
    //S'assurer qu'on a une réponse et comparer le mot de passe fourni par l'utilisateur avec celui stocké
    if (data && bcrypt.compareSync(passwordQuery, data.password)) {
      //Renvoyer le token de l'utilisateur + tout la donne trajet + stat
      res.json({ result: true, data: data });
    } else {
      //Si l'utilisateur n'existe pas ou que le mot de passe est invalide, envoyer un message d'erreur
      res.json({
        result: false,
        error: "User not found or wrong password",
      });
    }
  });
});

module.exports = router;
