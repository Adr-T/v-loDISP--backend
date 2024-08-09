var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const Rides = require("../models/rides");
const User = require("../models/users");
/* POST Histroric page. */
router.post("/", (req, res) => {
  // utiliser le module checkBody pour gérer les champs vides
  if (!checkBody(req.body, ["depart", "arrival", "travelTime"])) {
    res.json({ result: false, error: "Missing or empty filed" });
    return;
  }
  // methode findOne pour chercher dans la BDD utilisateur avec token
  User.findOne({ token: req.body.token }).then((dataUser) => {
    // et si il existe ajouter dans la BDD
    if (dataUser) {
      const newRides = new Rides({
        depart: req.body.depart,
        arrival: req.body.arrival,
        travelTime: req.body.travelTime,
        isGuest: true,
      });
      newRides.save().then((rides) => {
        // console.log(dataStat);
        // avec cet condition on verifier si elle a ete ajouter dans la BDD et apres on associer le trajet a lutilisateur
        if (rides) {
          User.updateOne(
            { _id: dataUser._id },
            { $push: { rides: rides } }
          ).then((dataUpdated) => {
            // console.log(dataUpdated);
            // on verifier avec ca si ca ete associer a lutilisateir
            if (dataUpdated.modifiedCount > 0) {
              // on recherche utilisateur dans la BDD et on renvoi tout les donne
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
router.get("/ss", async (req, res) => {
  await Rides.find().then((data) => (d = data));
  let array = [];
  for (const el of d) {
    const [resDepart, resArrive] = await Promise.all([
      fetch(
        `http://api-adresse.data.gouv.fr/reverse/?lon=${el.depart.lon}&lat=${el.depart.lat}`
      ),
      fetch(
        `http://api-adresse.data.gouv.fr/reverse/?lon=${el.arrival.lon}&lat=${el.arrival.lat}`
      ),
    ]);
    const [datadepart, dataArrive] = await Promise.all([
      resDepart.json(),
      resArrive.json(),
    ]);
    const velibStationMap = new Map();
    const depart = datadepart.features.map((el) => {
      return {
        depart: el.properties.label,
      };
    });
    const arrive = dataArrive.features.map((el) => {
      return {
        arrive: el.properties.label,
      };
    });
    array = depart.concat(arrive);

    res.json({
      result: true,
      trajet: array,
    });
  }
  // array3 = array1.concat(array2);
});

module.exports = router;
