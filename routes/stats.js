var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const Stats = require("../models/stats");
/* GET home page. */
router.post("/", (req, res) => {
  // utiliser le module checkBody pour gérer les champs vides
  if (!checkBody(req.body, ["noteVelo", "noteRide"])) {
    res.json({ result: false, error: "Missing or empty filed" });
    return;
  }

  const newStats = new Stats({
    noteVelo: req.body.noteVelo,
    noteRide: req.body.noteRide,
  });

  newStats.save().then((data) => {
    Stats.find().then((data) => {
      //Renvoyer tout la data du statistique

      res.json({ result: true, data });
    });
  });
});

module.exports = router;
