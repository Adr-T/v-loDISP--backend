const mongoose = require("mongoose");
const rideSchema = mongoose.Schema({
  depart: { latitude: Number, longitude: Number, date: String },
  arrival: { latitude: Number, longitude: Number, date: String },
  travelTime: String,
  isGuest: Boolean,
  date: Date,
});

const Ride = mongoose.model("rides", rideSchema);

module.exports = Ride;
