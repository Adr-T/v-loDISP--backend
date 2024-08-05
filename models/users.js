const userSchema = mongoose.Schema({
    username: String,
    name: String,
    password: String,
    token: String,
    // trajet: clef etrangère (a mettre en place)
    // stats : clef étrangère (à mettre en place)
});

const User = mongoose.model("users", userSchema);

module.exports = User;
