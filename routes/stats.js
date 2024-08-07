var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const Stats = require("../models/stats");
const User = require("../models/users");
/* GET home page. */
router.post("/", (req, res) => {
  // utiliser le module checkBody pour gérer les champs vides
  if (!checkBody(req.body, ["noteVelo", "noteRide", "token"])) {
    res.json({ result: false, error: "Missing or empty filed" });
    return;
  }

  User.findOne({ token: req.body.token }).then((dataUser) => {
    if (dataUser) {
      const newStats = new Stats({
        noteVelo: req.body.noteVelo,
        noteRide: req.body.noteRide,
        isGuest: true,
      });

      newStats.save().then((dataStat) => {
        console.log(dataStat);

        if (dataStat) {
          User.updateOne(
            { _id: dataUser._id },
            { $push: { stats: dataStat } }
          ).then((dataUpdated) => {
            console.log(dataUpdated);
            if (dataUpdated.modifiedCount > 0) {
              res.json({ result: true, stat: dataStat });
            }
          });
        }
      });
    } else {
      //s'il n'existe pas utilisateur on recuper quand meme statistique et on envoi dans la BDD
      const newStats = new Stats({
        noteVelo: req.body.noteVelo,
        noteRide: req.body.noteRide,
        isGuest: false,
      });

      newStats.save().then(() => {
        Stats.find().then((data) => {
          res.json({ result: true, stat: data });
        });
      });
    }
  });
});

module.exports = router;
