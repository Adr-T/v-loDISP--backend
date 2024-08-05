var express = require("express");
const User = require("../models/users");
var router = express.Router();

const uid2 = require("uid2");
const bcrypt = require("bcrypt");

/* GET users listing. */
// router.get("/", function (req, res, next) {
//   res.send("respond with a resource");
// });
// User.findOne({ username: req.body.username }).then((data) => {
//   if (data === null) {
//     const hash = bcrypt.hashSync(req.body.password, 10);

//     const newUser = new User({
//       username: req.body.username,
//       password: hash,
//       token: uid2(32),
//       canBookmark: true,
//     });

//     newUser.save().then((newDoc) => {
//       res.json({ result: true, token: newDoc.token });
//     });
//   } else {
//     // User already exists in database
//     res.json({ result: false, error: "User already exists" });
//   }
// });

// router.post("/signin", (req, res) => {
//   if (!checkBody(req.body, ["username", "password"])) {
//     res.json({ result: false, error: "Missing or empty fields" });
//     return;
//   }

//   User.findOne({ username: req.body.username }).then((data) => {
//     if (data && bcrypt.compareSync(req.body.password, data.password)) {
//       res.json({ result: true, token: data.token });
//     } else {
//       res.json({ result: false, error: "User not found or wrong password" });
//     }
//   });
// });

//créer un nouveau user
router.post("/signup", (req, res) => {
    //créer une regex pour gérer la casse
    let userQuery = new RegExp(req.body.username, "i");
    let passwordQuery = req.body.password;

    //utiliser le module checkBody pour gérer les champs vides
    if (!checkBody(req.body, ["username", "password"])) {
        res.json({ result: false, error: "Missing or empty filed" });
        return;
    }

    User.findOne({
        username: userQuery,
    }).then((data) => {
        if (data) {
            res.json({ result: false, error: "User already registered" });
        } else {
            const hash = bcrypt.hashSync(passwordQuery, 10);

            const newUser = new User({
                username: req.body.username,
                password: hash,
                token: uid2(32),
            });

            newUser.save().then((newDoc) => {
                res.json({ result: true, token: newDoc.token });
            });
        }
    });
});

module.exports = router;
