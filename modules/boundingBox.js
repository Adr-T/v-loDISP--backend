//Mettre en place une fonction réutilisable permettant de paramétrer une zone de 500 mètres autour d'une position donnée

const calculateBoundingBox = (latitude, longitude, radiusInMeters) => {
    const earthRadius = 6371000; // Rayon de la Terre en mètres

    // Conversion du rayon en latitude/longitude
    const deltaLat = radiusInMeters / earthRadius;
    const deltaLon =
        radiusInMeters / (earthRadius * Math.cos((Math.PI * latitude) / 180));

    // Conversion de radians en degrés
    const deltaLatDeg = deltaLat * (180 / Math.PI);
    const deltaLonDeg = deltaLon * (180 / Math.PI);

    // Bounding box en termes de lat/long
    const minLat = latitude - deltaLatDeg;
    const maxLat = latitude + deltaLatDeg;
    const minLon = longitude - deltaLonDeg;
    const maxLon = longitude + deltaLonDeg;

    return {
        minLat,
        maxLat,
        minLon,
        maxLon,
    };
};

// Exemple d'utilisation :
const latitude = 48.8566; // Latitude de la position
const longitude = 2.3522; // Longitude de la position
const radius = 500; // Rayon en mètres

// const boundingBox = calculateBoundingBox(latitude, longitude, radius);
// console.log(boundingBox);

module.exports = { calculateBoundingBox };
