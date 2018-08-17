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

//Functions that handle start and ending stop for step 5

  handleStartPoint(e) {
    let target = JSON.parse(e.target.value);
    console.log(e.target.id)
    this.setState({startingStop: target.name})
    this.setState({startingId: target.id})
  
  }

  handleEndPoint(e) {
    let target = JSON.parse(e.target.value);
    this.setState({endingStop: target.name})
    this.setState({endingId: target.id})

  }

  fetchLineInfo() {
    console.log(this.state.startingId)
    var start = this.state.startingId
    var end = this.state.endingId
    axios.get(`/api/connections/${start}`)
      .then(function (response) {
        console.log('Success')
        console.log(response);
    })
      .catch(function (error) {
        console.log(error);
    });
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