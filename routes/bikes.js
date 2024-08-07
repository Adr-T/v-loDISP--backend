var express = require("express");
var router = express.Router();
// const { checkBody } = require("../modules/checkBody");
router.get("/", async (req, res) => {
  let velibVeloAvailable;
  let velibParkingAvailable;
  let limVeloAvailable;

  await fetch(
    `https://velib-metropole-opendata.smovengo.cloud/opendata/Velib_Metropole/station_status.json`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        velibVeloAvailable = data.data.stations;
      } else {
        res.json({ veloAvailable: "not found" });
      }
    });
  await fetch(
    `https://velib-metropole-opendata.smovengo.cloud/opendata/Velib_Metropole/station_information.json`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        velibParkingAvailable = data.data.stations;
      } else {
        res.json({ parkingAvailable: "not found" });
      }
    });
  await fetch(
    `https://data.lime.bike/api/partners/v2/gbfs/paris/free_bike_status`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        limVeloAvailable = data.data.bikes;
      } else {
        res.json({ parkingAvailable: "not found" });
      }
    });
  await res.json({
    velibParkingAvailable,
    velibVeloAvailable,
    limVeloAvailable,
  });
});

module.exports = router;
