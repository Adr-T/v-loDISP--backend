//Mettre en place une fonction réutilisable permettant de vérifier si les champs de saisie sont vides
function checkBody(body, keys) {
    let isValid = true;

    for (let field of keys) {
        if (!body[field] || body[field] === "") {
            isValid = false;
        }
    }

    return isValid;
}

module.exports = { checkBody };
