const mongoose = require("mongoose");
const rideSchema = mongoose.Schema({
    depart: { lon: Number, lat: Number, date: Date },
    arrival: { lon: Number, lat: Number, date: Date },
    travelTime: String,
});

const Ride = mongoose.model("rides", rideSchema);

module.exports = Ride;
