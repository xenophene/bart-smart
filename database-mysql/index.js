const mysql = require('mysql');
const mysqlConfig = require('./config.js');
const fs = require('fs');

//Connecting to mySql

const connection = mysql.createConnection(mysqlConfig);
connection.connect( (err) => {
  if (err) {
    console.log('Could not connect to mySql');
  } else {
    console.log('Succesfully connected to mySql');
  }
});

//Function that queries to get all lines from the database

const getAllLines = function(callback) {
  connection.query('SELECT * FROM service_lines', (err, data) => {
    if (err) {
      console.log('Error getting all lines from the database');
      return;
    } else {
      console.log('Succesfully got info on lines from the database'); 
      callback(null, data);
    }
  }); 
};

//Function that queries to get all stops by line Id

const getAllStops = function(id, callback) {
  var arr = [id];
  connection.query('SELECT stations.name, stations.id, stations.is_favorite FROM stations INNER JOIN stops WHERE stations.id=stops.station_id AND line_id=?;', arr, (err, data) => {
    if (err) {
      console.log('Error getting all the stops by ID');
      return;
    } else {
      console.log('Succesfully got all the stop by ID');
      callback(null, data);
    }
  });
};

//Functions that aid toggle favorite stations
//TODO: refactor using promise chains

const checkCurrentFavs = function(id, callback) {
  var arr = [id];
  connection.query('SELECT is_favorite FROM stations WHERE stations.id=?;', arr, (err, data) => {
    if (err) {
      console.log('Error checking Fav', err);
      return;
    } else {
      toggleFavs(data[0].is_favorite, arr);   
      callback(null, data[0].is_favorite == '0' ? 1 : 0);
    }
  });
};

const toggleFavs = function(data, arr) {
  if (data == '0') {
    connection.query('UPDATE stations SET is_favorite = 1 where stations.id=?;', arr, (err, data) => {
      if (err) {
        console.log(err);
        return;
      } else {
        console.log('Succesfully added to favorite!');
      }
    });
  } else {
    connection.query('UPDATE stations SET is_favorite = 0 where stations.id=?;', arr, (err, data) => {
      if (err) {
        console.log(err);
        return;
      } else {
        console.log('Succesfully removed from favorite!');
      }
    });
  }
};

//Function that queries to get all stations

const getAllStations = function(callback) {
  connection.query('SELECT * FROM stations', (err,data) => {
    if (err) {
      console.log('Error getting all stations', err);
      return;
    } else {
      console.log('Succesfully fetched all stations');
      callback(null, data);
    }
  });
};

//Input = (station_name_A, station_name_B)
//Get all lines info 'for both stations
//Check if the lines have the same destination
//Yes
//Return the line
//No
//Check if the lines have overlapping transfer stops
//call function recursively
//Now Input = (transfer_station, station_name_B)

const handleLevelFive = function(station, cb) {  
  var arr = [station]  
  connection.query('select * from stops, service_lines where stops.line_id = service_lines.id and stops.station_id = ?;', arr, (err, data) => {
    if (err) {
      console.log('Error')
    } else {
      console.log(data)
    }
  })
};

//tests to check if the methods are working
  //getAllLines(() => console.log('getAllLines working'))
  //getAllStops(5, () => console.log('getAllStops working'))
  //checkCurrentFavs('2', () => console.log('checkCurrentFavs working'))
  //getAllStations(() => console.log('getAllStations working'))
  //getConnectingLines('Ashby', () => console.log('getConnectingLines working'))
  //handleLevelFive(5,  () => {console.log('hi');});

module.exports = {
  getAllLines,
  getAllStops,
  checkCurrentFavs,
  getAllStations,
  handleLevelFive
};
