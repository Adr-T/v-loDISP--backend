const mongoose = require("mongoose");
const statSchema = mongoose.Schema({
  // noteVelo: Number,
  noteRide: String,
  isGuest: Boolean,
});

const Stat = mongoose.model("stats", statSchema);

module.exports = Stat;
