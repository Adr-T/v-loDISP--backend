var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const Rides = require("../models/rides");
/* GET home page. */
router.post("/", (req, res) => {
  console.log(req.body);

  // utiliser le module checkBody pour gérer les champs vides
  if (!checkBody(req.body, ["depart", "arrival", "travelTime", "token"])) {
    res.json({ result: false, error: "Missing or empty filed" });
    return;
  }
  User.findOne({ token: req.body.token }).then((dataUser) => {
    if (dataUser) {
      const newRides = new Rides({
        depart: {
          lon: req.body.longitude,
          lat: req.body.longitude,
          date: req.body.date,
        },
        arrival: {
          lon: req.body.longitude,
          lat: req.body.longitude,
          date: req.body.date,
        },
        travelTime: req.body.travelTime,
      });
      newRides.save().then((rides) => {
        // console.log(dataStat);

        if (rides) {
          User.updateOne(
            { _id: dataUser._id },
            { $push: { rides: rides } }
          ).then((dataUpdated) => {
            console.log(dataUpdated);
            if (dataUpdated.modifiedCount > 0) {
              res.json({ result: true, stat: rides });
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
            Rides.find().then((data) => {
              res.json({ result: true, rides: data });
            });
          });
        }
      });
    }
  });
});

module.exports = router;
