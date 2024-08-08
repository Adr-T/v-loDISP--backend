var express = require("express");
var router = express.Router();

/* route alert message */
router.get("/", function (req, res) {
  // tableau pour recuperer le date
  let dataOriginal = [];
  // ce variable je definie pour comparer les date que on recoitt par API et apres je utilise filter pour trier
  let dateMinimumFinAlert = "2024-09-10";

  fetch(
    `https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/velo_deviation_montage_jop2024_polygone/records?limit=95`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        // console.log(data);
        // filter pour tries les date car y avait des date que on a pas besoin qui sont deja depassé
        data.results.filter((el) => {
          if (el.end_date >= dateMinimumFinAlert) {
            dataOriginal.push(el);
          }
        });
        // pour voir la longeur da tableaux
        // console.log(dataOriginal.length);

        res.json({ results: true, dataOriginal });
      } else {
        res.json({ results: false, dataOriginal: "no infromation" });
      }
    });
  // res.json({ result: false });
});

module.exports = router;
