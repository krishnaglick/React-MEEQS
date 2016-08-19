
import React, { Component } from 'react';
import {render} from 'react-dom';

import Rater from './rater.jsx';
import List from './list.jsx';

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
      <div className="ui centered grid">
        <div className="four wide column">
          <List loc={this.loc} />
        </div>
      </div>
    );
  }
}

render(<App/>, document.getElementById('app'));

export default App;
