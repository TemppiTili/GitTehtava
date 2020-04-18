
// Asenna ensin express npm install express --save

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var customerController = require('./customerController');

var fs = require("fs");

const hostname = '127.0.0.1';
const port = process.env.PORT || 3002;


//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Staattiset filut
app.use(express.static(__dirname + '/'));

// REST API Asiakas
app.route('/Types')
    .get(customerController.fetchTypes);

app.route('/Asiakas')
    .get(customerController.fetchAll)
    .post(customerController.create);

app.route('/Asiakas/:id')
    .put(customerController.update)
    .delete(customerController.delete);

app.get('/', function(request, response){
    fs.readFile("tehtävät45-48.html", function(err, data){
        response.writeHead(200, {'Content-Type' : 'text/html'});
        response.write(data);
        response.end();    
    });
});

app.listen(port, hostname, () => {
  console.log(`Server running AT http://${hostname}:${port}/`);
});
