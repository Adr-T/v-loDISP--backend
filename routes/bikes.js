var express = require("express"); // Création d'un routeur express
var router = express.Router();

// Définition d'une route GET à la racine du routeur
router.get("/", async (req, res) => {
  // let velibVeloAavailable;
  // let velibParkingAavailable;
  // let limVeloAvailable;

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
    velibStationMap.set(d.station_id, {
      latitude: d.lat,
      longitude: d.lon,
    });
  }

  // Transformation des données des stations Velib pour inclure les informations de disponibilité des vélos et les coordonnées
  const velibData = dataVelib1.data.stations.map((e) => {
    const coords = velibStationMap.get(e.station_id); // Récupération des coordonnées de la station
    return {
      stationId: e.station_id,
      bikesAvailable: e.num_bikes_available,
      ...coords, // Ajout des coordonnées au résultat
    };
  });

  // Transformation des données des vélos Lime pour inclure l'ID et les coordonnées des vélos
  const limeData = dataLime.data.bikes.map((e) => {
    return {
      bikeId: e.bike_id,
      latitude: e.lat,
      longitude: e.lon,
    };
  });

  // Envoi de la réponse en JSON avec les données des vélos Velib et Lime
  res.json({ velibData, limeData });
});

module.exports = router; // Export du routeur pour l'utiliser dans l'application
