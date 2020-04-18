'use strict'

// Asenna ensin mysql driver 
// npm install mysql --save

var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // HUOM! Älä käytä root:n tunnusta tuotantokoneella!!!!
  password: '',
  port: 3308, // Muuta portti vastaavaksi kuin oman SQL-tietokantasi portti
  database: 'asiakas'
});

module.exports = {

  // Asiakastyyppien haku
  fetchTypes: function (req, res) {
    connection.query('SELECT Avain, Lyhenne, Selite FROM Asiakastyyppi', function (error, results, fields) {
      if (error) {
        console.log("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error);
        res.send({
          "status": 500,
          "error": error,
          "response": null
        });
      } else {
        console.log("Data = " + JSON.stringify(results));
        res.json(results);
      }
    });

  },

  // Haetaan kaikki asiakkaat, tai hakuehtoja käyttäen
  fetchAll: function (req, res) {
    console.log("Hakuehdot: " + JSON.stringify(req.query));  // tulostaa hakuparametrit noden konsoliin
  
    let haku = "SELECT avain, nimi, osoite, postinro, postitmp, DATE_FORMAT(luontipvm, '%d.%m.%Y') as luontipvm, asty_avain FROM Asiakas WHERE 1=1";

    if (req.query.Nimi != undefined)
    haku += " AND nimi LIKE '" + req.query.Nimi + "%'";
    if (req.query.Osoite != undefined)
    haku += " AND osoite LIKE '" + req.query.Osoite + "%'";
    if (req.query.asty_avain != undefined)
    haku += " AND asty_avain =" + req.query.asty_avain;

  //  console.log(haku);  
    
    connection.query(haku, function (error, results) {
      if (error) {
        console.log("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error);
        res.send(JSON.stringify({
          "status": 500,
          "error": error,
          "response": null
        }));
      } else {
       res.statusCode = 200;
       res.send(results);
      }
    });
  },

  // Asiakkaan lisäys
  create: function (req, res) {
    let lisays = 'INSERT INTO asiakas(nimi, osoite, postinro, postitmp, luontipvm, asty_avain) VALUES (?, ?, ?, ?, CURDATE(), ?)';
    
    connection.query(lisays,
    [req.body.nimi, req.body.osoite, req.body.postinro, req.body.postitmp, req.body.asty_avain], (error, results, fields) => {
      if (error) {
        console.log(error.sqlMessage);
        throw error;
      } else {
        res.send(results); // tässä oletuspalautus (postman-kuva, Tehtävä_49_POSTMAN.png)
        //  res.send("Lisättiin " + results.affectedRows + " asiakas."); // tässä esimerkki kustomoidusta palautusviestistä.
      }
    });
    console.log("Lisättiin dataa: " + JSON.stringify(req.body));
  },

  // Asiakkaan tietojen päivittäminen
  update: function (req, res) {
    // Tämä ominaisuus kolmannen paketin tehtävissä
  },

  // Asiakkaan poistaminen
  delete: function (req, res) {
    // Tämä ominaisuus kakkospaketin tehtävissä
  }
}