var express = require("express"); // Création d'un routeur express
var router = express.Router();
const { dottBikes } = require("../json/dottBikes");
const { tierBikes } = require("../json/tierBikes");

const { calculateBoundingBox } = require("../modules/boundingBox");

// Définition d'une route GET à la racine du routeur
router.get("/:lat/:lon", async (req, res) => {
  // let velibVeloAavailable;
  // let velibParkingAavailable;
  // let limVeloAvailable;

  const { lat, lon } = req.params;

  const userBoundingBox = calculateBoundingBox(
    parseFloat(lat),
    parseFloat(lon),
    300
  );

  // Envoi de requêtes pour récupérer les données des stations Velib et Lime en parallèle
  const [resVelib1, resVelib2, resLime] = await Promise.all([
    fetch(
      "https://velib-metropole-opendata.smovengo.cloud/opendata/Velib_Metropole/station_status.json"
    ),
    fetch(
      "https://velib-metropole-opendata.smovengo.cloud/opendata/Velib_Metropole/station_information.json"
    ),
    fetch("https://data.lime.bike/api/partners/v2/gbfs/paris/free_bike_status"),
  ]);

  // Conversion des réponses en JSON en parallèle
  const [dataVelib1, dataVelib2, dataLime] = await Promise.all([
    resVelib1.json(),
    resVelib2.json(),
    resLime.json(),
  ]);

  // Création d'une carte pour stocker les informations des stations Velib avec station_id comme clé
  const velibStationMap = new Map();

  // Remplissage de la carte avec les coordonnées des stations Velib
  for (const d of dataVelib2.data.stations) {
    if (
      d.lat > userBoundingBox.minLat &&
      d.lat < userBoundingBox.maxLat &&
      d.lon > userBoundingBox.minLon &&
      d.lon < userBoundingBox.maxLon
    ) {
      velibStationMap.set(d.station_id, {
        latitude: d.lat,
        longitude: d.lon,
      });
    }
  }

  let velibData = [];
  // Transformation des données des stations Velib pour inclure les informations de disponibilité des vélos et les coordonnées
  for (const e of dataVelib1.data.stations) {
    const coords = velibStationMap.get(e.station_id); // Récupération des coordonnées de la station
    if (coords) {
      velibData.push({
        stationId: e.station_id,
        bikesAvailable: e.num_bikes_available,
        ...coords, // Ajout des coordonnées au résultat
      });
    }
  }

  // Transformation des données des vélos Lime pour inclure l'ID et les coordonnées des vélos
  let limeData = [];

  for (const d of dataLime.data.bikes) {
    if (
      d.lat > userBoundingBox.minLat &&
      d.lat < userBoundingBox.maxLat &&
      d.lon > userBoundingBox.minLon &&
      d.lon < userBoundingBox.maxLon
    ) {
      limeData.push({
        bikeId: d.bike_id,
        latitude: d.lat,
        longitude: d.lon,
      });
    }
  }
  // Transformation des données des vélos Dott pour inclure l'ID et les coordonnées des vélos
  let dottData = [];

  for (const d of dottBikes) {
    if (
      d.coordinates.latitude > userBoundingBox.minLat &&
      d.coordinates.latitude < userBoundingBox.maxLat &&
      d.coordinates.longitude > userBoundingBox.minLon &&
      d.coordinates.longitude < userBoundingBox.maxLon
    ) {
      dottData.push({
        bikeId: d.id,
        latitude: d.coordinates.latitude,
        longitude: d.coordinates.longitude,
      });
    }
  }
  // Transformation des données des vélos Tier pour inclure l'ID et les coordonnées des vélos
  let tierData = [];

  for (const d of tierBikes) {
    if (
      d.coordinates.latitude > userBoundingBox.minLat &&
      d.coordinates.latitude < userBoundingBox.maxLat &&
      d.coordinates.longitude > userBoundingBox.minLon &&
      d.coordinates.longitude < userBoundingBox.maxLon
    ) {
      tierData.push({
        bikeId: Math.random(400 * d.id),
        latitude: d.coordinates.latitude,
        longitude: d.coordinates.longitude,
      });
    }
  }

  // Envoi de la réponse en JSON avec les données des vélos Velib et Lime
  res.json({ velibData, limeData, dottData, tierData });
});

module.exports = router; // Export du routeur pour l'utiliser dans l'application
