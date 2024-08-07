var express = require("express");
var router = express.Router();

router.get("/", async (req, res) => {
    // let velibVeloAavailable;
    // let velibParkingAavailable;
    // let limVeloAvailable;

    const [resVelib1, resVelib2, resLime] = await Promise.all([
        fetch(
            "https://velib-metropole-opendata.smovengo.cloud/opendata/Velib_Metropole/station_status.json"
        ),
        fetch(
            "https://velib-metropole-opendata.smovengo.cloud/opendata/Velib_Metropole/station_information.json"
        ),
        fetch(
            "https://data.lime.bike/api/partners/v2/gbfs/paris/free_bike_status"
        ),
    ]);

    const [dataVelib1, dataVelib2, dataLime] = await Promise.all([
        resVelib1.json(),
        resVelib2.json(),
        resLime.json(),
    ]);

    const velibStationMap = new Map();

    for (const d of dataVelib2.data.stations) {
        velibStationMap.set(d.station_id, {
            latitude: d.lat,
            longitude: d.lon,
        });
    }

    const velibData = dataVelib1.data.stations.map((e) => {
        const coords = velibStationMap.get(e.station_id);
        return {
            stationId: e.station_id,
            bikesAvailable: e.num_bikes_available,
            ...coords,
        };
    });

    const limeData = dataLime.data.bikes.map((e) => {
        return {
            bikeId: e.bike_id,
            latitude: e.lat,
            longitude: e.lon,
        };
    });

    res.json({ velibData, limeData });
});

module.exports = router;
