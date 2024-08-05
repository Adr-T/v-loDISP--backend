const mongoose = require("mongoose");
const statSchema = mongoose.Schema({
  noteVelo: Number,
  noteRide: String,
});

const Stat = mongoose.model("stats", userSchema);

module.exports = Stat;
