const mongoose = require("mongoose");

//Mise en place de la connection avec la BDD via une variable d'environnement
const connectionString = process.env.CONNECTION_STRING;

mongoose
    .connect(connectionString, { connectTimeoutMS: 2000 })
    .then(() => console.log("Database connected"))
    .catch((error) => console.error(error));
