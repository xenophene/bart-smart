import React from 'react';
import $ from 'jquery';
import axios from 'axios';

class Lines extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newLines: [],
      lineStops: []
    }
  }

//Get requests and rendering for all lines
  fetchNewLines() {
    axios({
      method:'get',
      url:'/api/lines'
    })
    .catch(error => {
      console.log(error.response)
    })
    .then((response) => {
      this.changeStateOfLines(response)
    });
  }

  changeStateOfLines(data) {

    this.setState({newLines: data.data});
  }

//Get request and rendering for a specific line's stops

  handleSelectClick(e) {
    this.fetchInfoById(e.target.value);
  }
  
  fetchInfoById(id) {
    axios({
      method:'get',
      url:`/api/lines/${id}`
    })
    .then((response) => {
      this.changeStateOfStops(response.data);
    })
    .catch(error => {
      console.log(error.response);
    });
  }

  changeStateOfStops(data) {
    this.setState({lineStops: data});
  }

//Get request, rendering and storing values for favorites

  handleAddFavs(e) {
    var data = e.target.value
    axios({
      method: "get",
      url: `/api/stops/${data}`
    })
    .then((response) => {
      var newLineStops = this.state.lineStops.map( (stop) => {
        if (stop.id === data) {
          stop.is_favorite = response.data
        }
        return stop
      }) 
      this.setState({lineStops: newLineStops})
    })
    .catch(error => {
      console.log(error.response);
    });
  } 

//Life cycle

  componentDidMount() {
    this.fetchNewLines();
    this.fetchInfoById(1);
  }

  render() {
    return (
      <div className="lines-view">
      <div className="selections">
        Choose a line:
        <select 
          onChange={this.handleSelectClick.bind(this)}>
          {this.state.newLines.map( (line, index) =>
            <option 
              key={index}
              value={line.id}>
              {line.name}
            </option>
          )}
        </select>
      </div>

      <div className="lines-stop-list">
        <ul>
          { this.state.lineStops.map( (stop, index) =>
            <li 
              key={index}
              value={stop.id}
              onClick={this.handleAddFavs.bind(this)}>
              {stop.is_favorite == 0 ? stop.name : stop.name + '  ❤ '}
            </li>
          )}
        </ul>
      </div>
    </div>
    )
  }
}

export default Lines;
