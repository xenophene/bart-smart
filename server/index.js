const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const db = require('../database-mysql');

//Middlewares

app.use(express.static(__dirname + '/../react-client/dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Request to get all the lines from service lines

app.get('/api/lines', (req, res) => {
  console.log('This is invokes')
  db.getAllLines((err, data) => {
  	if (err) {
  		console.log('Error getting all lines from service lines', err)
  		return
  	} else {
      res.send(JSON.stringify(data))
      console.log(JSON.stringify(data))
  	}
  })
});

//Request to get all the stops by specific line Id

app.get('/api/lines/:lineId', (req,res) => {
  db.getAllStops(req.params.lineId, (err, data) => {
    if(err) {
      console.log('Error getting all stops by line Id', err)
      return
    } else {
      res.send(JSON.stringify(data))
      console.log(data)
    }
  })
});

//Request to toggle stations to favorite

app.get('/api/stops/:stopId', (req, res) => {
  db.checkCurrentFavs(req.params.stopId, (err, data) => {
    if (err) {
      console.log("Error toggling favorites", err)
      res.send('error')
    } else {
      res.send(data.toString())
    }
  })
})

//Request for all stations

app.get('/api/stations', (req, res) => {
  db.getAllStations((err, data) => {
    if (err) {
      console.log('Error getting stations', err)
    } else {
      console.log('Succesfully getting stations')
      res.send(data)
    }
  })
})


//Request to get connecting lines for two stations

app.get('/api/connections/:stationID', (req,res) => {
  db.handleLevelFive(req.params.stationID, (err, data) => {
    if (err) {
      console.log('Error handling level five', err)
    } else {
      res.send(data)
    }
  })
})

app.get('/finalLine/:lineInfo', (req, res) => {
  db.getAllLineInfo(req.params.lineInfo, (err, data) => {
    if (err) {
      console.log('Error getting line info')
    } else {
      res.send(data)
    }
  })
})

//TRANSFORM WORKS BEGIN

app.get('/api/stations/allLinesForStop/:startingStationId', (req, res) => {
  db.getAllTransferLines(req.params.startingStationId, (err, data) => {
    if (err) {
      console.log('Error getting TransferLines Info')
    } else {
      res.send(data)
    }
  })
})


app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
