var express = require('express');
var body = require('body-parser');
var request = require('request');
var moment = require('moment');
const cors = require('cors')

let listData ='';


// Initialize Express App
var app = express();

var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

app.use(cors(corsOptions))
app.use(body.urlencoded({ extended: false }));
app.use(body.json());



var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
// Set Static Path

app.get('/', function (req, res) {
	res.send('default route');
});

// Import API data for earthquakes
app.get('/getList', (req, res) => {
	request(url, (error, response, body) => {
		if (!error && response.statusCode == 200) {
			var info = JSON.parse(body)
			// do more stuff
			listData = info.features;
			res.send(listData);
		}
	}).on('error', function (e) {
		console.log("Got an error: ", e);
	});
});

port = process.env.PORT || 3000;

app.listen(port, function () {
	console.log("listening to port " + port);
})

