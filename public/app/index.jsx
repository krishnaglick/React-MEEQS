
import React, { Component } from 'react';
import {render} from 'react-dom';

import List from './list.jsx';

/* globals document, navigator */

class App extends Component {
  constructor(props) {
    super(props);
    this.loc = {};
    this.hasLoc = new Promise((res) => {
      navigator.geolocation.getCurrentPosition((position) => {
        this.loc.lat = position.coords.latitude;
        this.loc.long = position.coords.longitude;
        res();
      });
    });
  }

  render() {
    return (
      <div className="ui centered grid">
        <div className="six wide column">
          <List loc={this.loc} hasLoc={this.hasLoc} />
        </div>
      </div>
    );
  }
}

render(<App/>, document.getElementById('app'));

export default App;
