const mongoose = require("mongoose");
const tierBikesSchema = mongoose.Schema({
  id: Number,
  provider: String,
  coordinates: { latitude: Number, longitude: Number },
});

const TierBikes = mongoose.model("tierBikes", tierBikesSchema);

module.exports = TierBikes;
