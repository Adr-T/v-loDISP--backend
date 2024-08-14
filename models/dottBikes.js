const mongoose = require("mongoose");

const dottBikesSchema = mongoose.Schema({
  id: Number,
  provider: String,
  coordinates: { latitude: Number, longitude: Number },
});

const DottBikes = mongoose.model("dottBikes", dottBikesSchema);

module.exports = DottBikes;
