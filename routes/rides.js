var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const Rides = require("../models/rides");
const User = require("../models/users");
/* GET home page. */
router.post("/", (req, res) => {
  // utiliser le module checkBody pour gérer les champs vides
  if (!checkBody(req.body, ["depart", "arrival", "travelTime"])) {
    res.json({ result: false, error: "Missing or empty filed" });
    return;
  }
  User.findOne({ token: req.body.token }).then((dataUser) => {
    if (dataUser) {
      const newRides = new Rides({
        depart: req.body.depart,
        arrival: req.body.arrival,
        travelTime: req.body.travelTime,
        isGuest: true,
      });
      newRides.save().then((rides) => {
        // console.log(dataStat);
        if (rides) {
          User.updateOne(
            { _id: dataUser._id },
            { $push: { rides: rides } }
          ).then((dataUpdated) => {
            // console.log(dataUpdated);
            if (dataUpdated.modifiedCount > 0) {
              User.findById(dataUser._id.toString())
                .populate("rides")
                .populate("stats")
                .then((d) => res.json({ result: true, rides: d }));
            }
          });
        }
      });
    } else {
      //s'il n'existe pas utilisateur on recuper quand meme statistique et on envoi dans la BDD
      console.log("hello");

      const newRides = new Rides({
        depart: req.body.depart,
        arrival: req.body.arrival,
        travelTime: req.body.travelTime,
        isGuest: false,
      });
      newRides.save().then(() => {
        Rides.find().then((data) => {
          res.json({ result: true, rides: data });
        });
      });
    }
  });
});

module.exports = router;
