const mongoose = require("mongoose");
const rideSchema = mongoose.Schema({
  depart: { lon: Number, lat: Number, date: String },
  arrival: { lon: Number, lat: Number, date: String },
  travelTime: String,
  isGuest: Boolean,
});

const Ride = mongoose.model("rides", rideSchema);

module.exports = Ride;
