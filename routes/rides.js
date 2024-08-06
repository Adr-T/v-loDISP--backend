var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const Rides = require("../models/rides");
/* GET home page. */
router.post("/", (req, res) => {
  //   utiliser le module checkBody pour gérer les champs vides
  if (!checkBody(req.body, ["depart", "arrival", "travelTime"])) {
    res.json({ result: false, error: "Missing or empty filed" });
    return;
  }

  const newRides = new Rides({
    depart: { lon: Number, lat: Number, date: Date },
    arrival: { lon: Number, lat: Number, date: Date },
    travelTime: String,
  });

  newRides.save().then((data) => {
    Stats.find().then((data) => {
      // Renvoyer tout la data du statistique
      res.json({ result: true, data });
      // if (data) {
      // } else {
      //   res.json({ result: "we d'ont have stats :)" });
      // }
    });
  });
});

module.exports = router;
