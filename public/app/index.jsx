
import React, { Component } from 'react';
import {render} from 'react-dom';

import Restaurant from './Restaurant.jsx';

/* globals document, navigator */

class App extends Component {
  constructor(props) {
    super(props);
    this.loc = {};
    navigator.geolocation.getCurrentPosition((position) => {
      this.loc.lat = position.coords.latitude;
      this.loc.long = position.coords.longitude;
    });
  }
  render() {
    return (
      <div>
        <Restaurant loc={this.loc} />
      </div>
    );
  }
}

render(<App/>, document.getElementById('app'));

export default App;
