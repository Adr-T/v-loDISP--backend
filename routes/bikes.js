var express = require("express");
var router = express.Router();

router.get("/", async (req, res) => {
    let velibVeloAavailable;
    let velibParkingAavailable;
    let limVeloAvailable;

    await fetch(
        `https://velib-metropole-opendata.smovengo.cloud/opendata/Velib_Metropole/station_status.json`
    )
        .then((response) => response.json())
        .then((data) => {
            if (data) {
                velibVeloAavailable = data.data.stations;
            } else {
                res.json({ veloAavailable: "not found" });
            }
        });
    await fetch(
        `https://velib-metropole-opendata.smovengo.cloud/opendata/Velib_Metropole/station_information.json`
    )
        .then((response) => response.json())
        .then((data) => {
            if (data) {
                velibParkingAavailable = data.data.stations;
            } else {
                res.json({ parkingAavailable: "not found" });
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
                res.json({ parkingAavailable: "not found" });
            }
        });
    await res.json({
        velibParkingAavailable,
        velibVeloAavailable,
        limVeloAvailable,
    });
});

module.exports = router;
