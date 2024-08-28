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
                        User.findOne({ token: newDoc.token }).then((data) => {
                            //Renvoyer le token de l'utilisateur + tout la donne trajet + stat
                            res.json({ result: true, data });
                        });
                    });
                }
            } else {
                res.json({
                    result: false,
                    user: "email ivalid",
                    source: "email",
                });
            }
        }
    });
});

//Se connecter à un compte utilisateur
router.post("/signin", (req, res) => {
    // console.log(req.body);

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
            //Renvoyer le token de l'utilisateur + toute la data liée à l'utilisateur
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
// update password
router.post("/changepassword", (req, res) => {
    //utiliser le module checkBody pour gérer les champs vides
    if (!checkBody(req.body, ["token", "newPassword", "currentPassword"])) {
        res.json({ result: false, error: "Missing or empty fields" });
        return;
    }

    User.findOne({ token: req.body.token }).then((data) => {
        //Vérifier que le nouveau mot de passe est différent de celui déjà stocké
        const hash = bcrypt.hashSync(req.body.newPassword, 10);
        if (!bcrypt.compareSync(hash, data.password)) {
            res.json({
                result: false,
                user: "password must be different from current password",
            });
        }
        //si le nouveau mot de passe est effectivement différend, alors changement accepté
        if (data && !bcrypt.compareSync(hash, data.password)) {
            User.updateOne({ token: req.body.token }, { password: hash }).then(
                () => {
                    res.json({
                        result: true,
                        user: "your password has been changed",
                    });
                }
            );
        } else {
            //Si l'utilisateur n'existe pas ou que le mot de passe est invalide, envoyer un message d'erreur
            res.json({
                result: false,
                error: "User not found or wrong password",
            });
        }
    });
});
// update username
router.post("/changeusername", (req, res) => {
    //utiliser le module checkBody pour gérer les champs vides
    if (!checkBody(req.body, ["token", "newUsername"])) {
        res.json({ result: false, error: "Missing or empty fields" });
        return;
    }

    User.findOne({ token: req.body.token }).then((data) => {
        //S'assurer que l'utilisateur existe grâce à son token

        if (data) {
            //si l'utilisateur existe, changement de username
            User.updateOne(
                { username: data.username },
                { username: req.body.newUsername }
            ).then(() => {
                res.json({
                    result: true,
                    user: "your username has been changed",
                });
            });
        } else {
            //Si l'utilisateur n'existe pas ou que le mot de passe est invalide, envoyer un message d'erreur
            res.json({
                result: false,
                error: "User not found",
            });
        }
    });
});
// delete username
router.delete("/delete", (req, res) => {
    //utiliser le module checkBody pour gérer les champs vides
    if (!checkBody(req.body, ["token"])) {
        res.json({ result: false, error: "Missing or empty fields" });
        return;
    }

    //Si l'utilisateur est trouvé, suppression du compte, sinon message d'erreur
    User.deleteOne({ token: req.body.token }).then((data) => {
        if (data.deletedCount > 0) {
            res.json({ result: true, status: "your account has been deleted" });
        } else {
            res.json({ result: false, status: "user not found" });
        }
    });
});

module.exports = router;
