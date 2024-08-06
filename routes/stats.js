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
      });

      newStats.save().then((dataStat) => {
        if (dataStat) {
          User.updateOne(
            { _id: dataUser._id },
            { $push: { stats: dataStat._id } }
          ).then((dataUpdated) => {
            console.log(dataUpdated);
            if (dataUpdated.modifiedCount > 0) {
              res.json({ result: true, stat: dataStat });
            }
          });
        }
        // Stats.find().then((data) => {
        //   //Renvoyer tout la data du statistique

        //   res.json({ result: true, data });
        // });
      });
    } else {
      //s'il n'existe pas
    }
  });
});

module.exports = router;
