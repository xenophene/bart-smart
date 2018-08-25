import React from 'react';

class TransferStations extends React.Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    render() {
        return (
        
        <div className="conditional">
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
        </div>
        )
    }
}

export default TransferStations