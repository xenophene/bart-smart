import React from 'react';
import $ from 'jquery';
import axios from 'axios';
import TransferStations from './TransferStations.jsx'

class TripPlanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allStations: [],
      startingStop: 'Starting Station',
      endingStop: 'Ending Station',
      startingId: [],
      endingId: [],
      startingDB: '',
      chosenLineName: '',
      chosenTowards: '',
      chosenColor: '',
      allStops: '',
      nextStops: ['Middle Station A', ' Middle Station B', ' Middle Station C'],
      transfer_rendering: false
    }
  }

//Get all station names and filter favorites to the top

  fetchNewStations() {
    $.ajax({
      type: "GET",
      url: "/api/stations",
      success: (result) => {
        this.filterStations(result)  
      }
    }) 
  }

  filterStations(result) {
    var sort = result.sort( (x,y) => {
      return y.is_favorite - x.is_favorite
    })
    this.setState({allStations: sort})
  }

//Functions that handle and get routing from database

  handleStartPoint(e) {
    let target = JSON.parse(e.target.value);
    this.setState({startingStop: target.name})
    this.setState({startingId: target.id})
  }

  handleEndPoint(e) {
    let target = JSON.parse(e.target.value);
    this.setState({endingStop: target.name})
    this.setState({endingId: target.id})
  }

  fetchLineInfo() {
    var start = this.state.startingId
    var end = this.state.endingId
    axios.get(`/api/connections/${start}`)
      .then((response) => {
        console.log('Success fetched Start info from DB')
        this.setState({startingDB: response.data})
        var resultLine = this.findLines(this.state.startingDB, this.state.startingId, this.state.endingId)
        this.setState({chosenLine: resultLine})
        this.fetchLine(this.state.chosenLine)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  fetchLine(line) {
    axios.get(`/finalLine/${line}`)
      .then((response) => {
        this.handleChosenLineInfo(response.data)
      })
      .catch(function ( error) {
        console.log(error)
      });
  }

//Functions that manage data for routint 

  findLines(start, startId, endId) {
    var betterData = this.createBetterDataPackage(start);
    for (var key in betterData) {
      if (betterData[key].indexOf(endId) > betterData[key].indexOf(startId)){
        this.setState({allStops: betterData[key]})
        return key
      }
    }
  };

  createBetterDataPackage(data) {
    var newObj = {};
    data.forEach( obj => {
      newObj[obj.line_id] === undefined ? newObj[obj.line_id] = [obj.station_id] : newObj[obj.line_id].push(obj.station_id)
    });
    return newObj;
  }

  handleChosenLineInfo(data) {
    var lineName = ''
    var towards = ''
    var color = ''

    data.forEach( (obj) => {
      var lineColor = obj.name.split(' ')
      for (var i=0; i<lineColor[0].length -1; i++) {
        lineName += lineColor[0][i]
      }
      if (lineColor[3]) {
        towards += lineColor[1] + ' ' + lineColor[2] + ' ' + lineColor[3]
      } else {
      towards += lineColor[1] + ' ' + lineColor[2]
      }
      color += obj.color
    })

    this.setState({chosenLineName: lineName})
    this.setState({chosenTowards: towards})
    this.setState({chosenColor: color})

    this.handleStationsToDisplay()
  }

  handleStationsToDisplay() {
    var nextStopsArr = [];
    var nextStopsName = [];

    var start = this.state.allStops.indexOf(this.state.startingId)
    var end = this.state.allStops.indexOf(this.state.endingId)

    for (var i=start; i<=end; i++) {
      nextStopsArr.push(this.state.allStops[i])
    }

    nextStopsArr.forEach( (elem) => {
      this.state.allStations.forEach( (obj) => {
        if (elem == obj.id) {
          nextStopsName.push(obj.name)
        }
      });
    });

    this.setState({nextStops: nextStopsName})
  }

//Life cycle

  componentDidMount() {
    this.fetchNewStations()
  }

  render() {
    let individual_stations = this.state.allStations.map( (station, index) =>
      <option key={index}>
        {station.name}
      </option> 
    );

    return (
    <div className="trip-planner-view">
      <div className="selections">
      
        Start: 
        <select
          onChange={this.handleStartPoint.bind(this)}>
          {this.state.allStations.map( (station, index) =>
            <option 
              key={index}
              value={JSON.stringify({'name':station.name, 'id': station.id})}
              >
                {station.name}
            </option> 
          )}
        </select>

        <br />

        End: 
        <select
          onChange={this.handleEndPoint.bind(this)}>
          {this.state.allStations.map( (station, index) =>
            <option 
              key={index}
              value={JSON.stringify({'name':station.name, 'id': station.id})}
              >
                {station.name}
            </option> 
          )}
        </select>

        <br />

        <button
          onClick={this.fetchLineInfo.bind(this)}>
          Go!</button>
      </div>

      <div className="directions">
        <div className="directions-summary">
          <p className="line-name">{this.state.startingStop} to {this.state.endingStop}</p>
          <p>31 minutes (arrive at 5:51pm)</p>
        </div>

        <div className="directions-step">
          <div className="directions-line-header">
            <p className="line-name">Start at {this.state.startingStop}</p>
          </div>
        </div>

        <div className="directions-step">
          <div className="directions-line-header">
            <div className="line-circle" style={{backgroundColor: "#"+ `${this.state.chosenColor}`}}></div>
            <p className="line-name">{this.state.chosenLineName} Line</p>
            <p className="line-direction">{this.state.chosenTowards}</p>
          </div>
          <ul>
            {this.state.nextStops.map( (stops, index) => 
              <li
                key={index}
              >{stops}</li>
            )}
          </ul>
        </div>

        {this.state.transfer_rendering ? <TransferStations /> : null}

        <div className="directions-step">
          <div className="directions-line-header">
            <p className="line-name">Arrive at {this.state.endingStop}</p>
          </div>
        </div>
      </div>
    </div>
  )
 }
}

export default TripPlanner;