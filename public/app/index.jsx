
import React, { Component } from 'react';
import { render } from 'react-dom';

import List from './list.jsx';
import Rater from './modules/rater.jsx';
import _ from 'lodash';

/* globals document, navigator */

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchMode: false
    };

    this.setActiveItem = this.setActiveItem.bind(this);
    this.searchModeOff = this.searchModeOff.bind(this);
    this.searchModeOn = this.searchModeOn.bind(this);

    this.loc = {};
    this.hasLoc = new Promise((res) => {
      navigator.geolocation.getCurrentPosition((position) => {
        this.loc.lat = position.coords.latitude;
        this.loc.long = position.coords.longitude;
        res(this.loc);
      });
    });
  }

  setActiveItem(e) {
    _.forEach(e.currentTarget.getElementsByClassName('item'), (item) => {
      item.className = 'item';
    });
    e.target.className = 'active item';
  }

  searchModeOff() {
    this.setState({searchMode: false});
  }

  searchModeOn() {
    this.setState({searchMode: true});
  }

  render() {
    const { searchMode } = this.state;

    return (
      <div className="ui centered grid">
        <div className="three wide column">
          <div className="ui vertical menu" onClick={this.setActiveItem}>
            <a className="active item" onClick={this.searchModeOff}>
              List
            </a>
            <a className="item" onClick={this.searchModeOn}>
              Search
            </a>
          </div>
        </div>
        <div className="six wide column">
          {(() => {
            if(searchMode)
              return <Rater hasLoc={this.hasLoc} />;
            else
              return <List hasLoc={this.hasLoc} searchMode={this.state.searchMode} />;
          })()}
        </div>
      </div>
    );
  }
}

render(<App/>, document.getElementById('app'));

export default App;
