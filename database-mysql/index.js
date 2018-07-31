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

const handleLevelFive = function(A, B, cb) {      

  const allLineInfo = function(station_name) {

    connection.query('select stations.id from stations where stations.name=?;', [station_name], (err, dataA) => {

      var obj= {
        station_id : null,
        lines_id : [],
        lines_name : null,
        lines_color : null,
        transits: null,
        destinations_id : null,
        destinations_station_name : null
      };  

      for (var key in dataA) {
        obj.station_id = dataA[key].id;
      }
      //Lines Id
      connection.query('select stops.line_id from stops inner join stations where stations.id=stops.station_id and stations.id=?;', [obj.station_id], (err, dataA) => {
        var arr = [];
        for (var key in dataA) {
          arr.push(dataA[key].line_id);
        }
        obj.lines_id = arr;
      
        var array = [];
        for (var i=0; i<obj.lines_id.length; i++) {
          connection.query('select id, name, color, destination_id, origin_id from service_lines where service_lines.id =?;', [obj.lines_id[i]], (err, dataA) => {
          
            cantThinkOfAnyOtherWayToDoThis(dataA, B, cb); 
          });
        }
      });
    });
  };
  allLineInfo(A);
};

const cantThinkOfAnyOtherWayToDoThis = function (dataA, B, cb) {

  const allLineInfo = function(dataA, station_name, cb) {

    connection.query('select stations.id from stations where stations.name=?;', [station_name], (err, dataB) => {

      var obj= {
        station_id : null,
        lines_id : [],
        lines_name : null,
        lines_color : null,
        transits: null,
        destinations_id : null,
        destinations_station_name : null
      };  

      for (var key in dataB) {
        obj.station_id = dataB[key].id;
      }
      //Lines Id
      connection.query('select stops.line_id from stops inner join stations where stations.id=stops.station_id and stations.id=?;', [obj.station_id], (err, dataB) => {
        var arr = [];
        for (var key in dataB) {
          arr.push(dataB[key].line_id);
        }
        obj.lines_id = arr;
      
        var array = [];
        for (var i=0; i<obj.lines_id.length; i++) {
          var count = obj.lines_id.length;
          connection.query('select id, name, color, destination_id, origin_id from service_lines where service_lines.id =?;', ['obj.lines_id[i]'], (err, dataB) => {
            if (err) {
              console.log(err);
            } else {
              getOutOfTheForLoop(dataA, dataB, count, cb);
            }
          });
        }
      });
    });
  };
  allLineInfo(dataA, B, cb);
};

//My last query is inside of a for loop and having the callback within 
//the foorloop responses to the server 4 times and outside of the foor loop
//I dont gave access to my data since its outside of the query success
//So im handling the number of loops here

var counter = 1;
var A = [];
var B = [];

const getOutOfTheForLoop = function(dataA, dataB, count, cb) {
  cb(null, 'hi','bye')
};


console.log(A,B)


handleLevelFive('Ashby', 'Colma', () => {console.log('hi');});

//tests to check if the methods are working
//getAllLines(() => console.log('getAllLines working'))
//getAllStops(5, () => console.log('getAllStops working'))
//checkCurrentFavs('2', () => console.log('checkCurrentFavs working'))
//getAllStations(() => console.log('getAllStations working'))
//getConnectingLines('Ashby', () => console.log('getConnectingLines working'))

module.exports = {
  getAllLines,
  getAllStops,
  checkCurrentFavs,
  getAllStations,
  handleLevelFive
};
