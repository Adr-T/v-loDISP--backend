var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const Stats = require("../models/stats");
const User = require("../models/users");
/* GET home page. */
router.post("/", (req, res) => {
    console.log(req.body);

    // utiliser le module checkBody pour gérer les champs vides
    if (!checkBody(req.body, ["noteRide"])) {
        res.json({ result: false, error: "Missing or empty filed" });
        return;
    }
    // on cherche luser avec token pour pouvoir mettre statisque dans la BDD de utilisateur

    User.findOne({ token: req.body.token }).then((dataUser) => {
        if (dataUser) {
            const newStats = new Stats({
                // noteVelo: req.body.noteVelo,
                noteRide: req.body.noteRide,
                isGuest: true,
            });

            newStats.save().then((dataStat) => {
                // console.log(dataStat);
                // on check si ca ete bien enregistre et puis on update BDD de utilisateur avec new stats
                if (dataStat) {
                    User.updateOne(
                        { _id: dataUser._id },
                        { $push: { stats: dataStat._id } }
                    ).then((dataUpdated) => {
                        // console.log(dataUpdated);
                        if (dataUpdated.modifiedCount > 0) {
                            User.findById(dataUser._id.toString())
                                .populate("stats")
                                .populate("rides")
                                .then((d) =>
                                    res.json({ result: true, stat: d })
                                );
                        }
                    });
                }
            });
        } else {
            // console.log("else", dataUser);
            // //s'il n'existe pas utilisateur on recuper quand meme statistique et on envoi dans la BDD
            const newStats = new Stats({
                // noteVelo: req.body.noteVelo,
                noteRide: req.body.noteRide,
                isGuest: true,
            });
            newStats.save().then((data) => {
                // console.log(data);
                Stats.find().then((data) => {
                    res.json({ result: false, stat: data });
                });
            });
        }
    });
});
router.get("/:token", (req, res) => {
    User.findOne({ token: req.params.token }).then((dataUser) => {
        if (dataUser) {
            User.findById(dataUser._id.toString())
                .populate("stats")
                .populate("rides")
                .then((d) => res.json({ result: true, stat: d }));
        } else {
            res.json({ result: false, user: "usernotfound" });
        }
    });
});

module.exports = router;
