import React from 'react';
import $ from 'jquery';
import axios from 'axios';

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
      endingDB: ''
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

//Functions that handle start and ending stops

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
        this.handleStartingDB(response.data)
    })
      .catch(function (error) {
        console.log(error);
    });

    axios.get(`/api/connections/${end}`)
    .then((response) => {
      console.log('Success fetched End info from DB')
      this.handleEndingDB(response.data)
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  
  handleStartingDB(data) {
    this.setState({startingDB: data})
  }
  
  handleEndingDB(data) {
    this.setState({endingDB: data})
    console.log(this.state.startingDB)
    this.findLines(this.state.startingDB, this.state.endingDB)
  }

// Route optimization algorithm

  findLines(start, end) {
    this.createBetterDataPackage(start)
    
  })

  createBetterDataPackage(data) {
    var newObj = {};
   data.forEach( obj => {
     newObj[obj.line_id] === undefined ? newObj[obj.line_id] = [obj.station_id] : newObj[obj.line_id].push(obj.station_id)
   })
   return newObj;
 }


  



  // var overlappingDestinations = []

  // start.forEach((startObjects) => {
  //   end.forEach((endObjects) => {
  //     if (startObjects.destination_id === endObjects.destination_id) {
  //       overlappingDestinations.push([startObjects.destination_id, startObjects.name, startObjects.color])
  //     }
  //   })
  // })
  // console.log(overlappingDestinations)
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

    console.log('startID:', this.state.startingId)
    console.log('endingID:', this.state.endingId)
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
            <div className="line-circle" style={{backgroundColor: "#ed1d24"}}></div>
            <p className="line-name">Red Line</p>
            <p className="line-direction">towards Station C</p>
          </div>
          <ul>
            <li> Station A </li>
            <li> Station B </li>
            <li> Station C </li>
          </ul>
        </div>

        <div className="directions-step">
          <div className="directions-line-header">
            <p className="line-name">Change Trains</p>
          </div>
        </div>

        <div className="directions-step">
          <div className="directions-line-header">
            <div className="line-circle" style={{backgroundColor: "#0099cc"}}></div>
            <p className="line-name">Blue Line</p>
            <p className="line-direction">towards Station F</p>
          </div>
          <ul>
            <li> Station C </li>
            <li> Station D </li>
            <li> Station E </li>
          </ul>
        </div>

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