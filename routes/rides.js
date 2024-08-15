var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const Rides = require("../models/rides");
const User = require("../models/users");

/* POST Histroric page. */
// avec cet route on envoi dans la base de donnee les detail de trajet
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
        date: new Date(),
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
              // populate il envoi user avec trajet et stat
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
        date: new Date(),
      });
      newRides.save().then(() => {
        Rides.find().then((data) => {
          res.json({ result: true, rides: data });
        });
      });
    }
  });
});
router.post("/historique", async (req, res) => {
  // on cherche dans da BDD utilisateur avec token
  const user = await User.findOne({ token: req.body.token }).populate("rides");

  // condition si lutilisateur se trouve dans la BDD on envoi la donné cote front ent
  if (user.rides) {
    let array = [];

    for (const el of user.rides) {
      const [resDepart, resArrive] = await Promise.all([
        fetch(
          `http://api-adresse.data.gouv.fr/reverse/?lon=${el.depart.longitude}&lat=${el.depart.latitude}`
        ),
        fetch(
          `http://api-adresse.data.gouv.fr/reverse/?lon=${el.arrival.longitude}&lat=${el.arrival.latitude}`
        ),
      ]);

      const [datadepart, dataArrive] = await Promise.all([
        resDepart.json(),
        resArrive.json(),
      ]);

      const departure = datadepart.features[0].properties.label;
      const arrival = dataArrive.features[0].properties.label;
      const travelTime = el.travelTime;
      const date = el.date;

      array.push({ departure, arrival, travelTime, date });
    }

    res.json({
      result: true,
      trajet: array,
    });
  } else {
    // si on a pas les donnee ...
    res.json({
      result: false,
      user: "user not found",
    });
  }
  // array3 = array1.concat(array2);
});

module.exports = router;
