
import React, { Component } from 'react';
import Restaurant from './modules/restaurant.jsx';

import searcher from './modules/searcher';
import _ from 'lodash';

/* globals $ */

class List extends Component {

  constructor(props) {
    super(props);

    this.state = {
      locations: [{name: 'Loading nearby restaurants!', id: 'temp'}],
    };

    this.searcher = new searcher();
    this.loadRestaurants = this.loadRestaurants.bind(this);

    props.hasLoc.then(this.loadRestaurants);
  }

  async loadRestaurants(location) {
    try {
      location = location || this.props.loc;
      const locations = await this.searcher
      .setLocation(location)
      .loadLocations();
      console.log(locations);
      this.setState({locations});
    }
    catch(x) {
      console.log('Error loading restaurants for list!', x);
    }
  }

  render() {
    const { locations } = this.state;


    return (
      <div className="ui large form segment">
        <div className="ui two stackable cards">
          {_.map(locations, (location) => {
            return (
              <div className="field" key={location.id}>
                <Restaurant hasLoc={this.props.hasLoc} location={location} />
              </div>
            );
          })
          }
        </div>
        <img src="./assets/images/google.png" />
      </div>
    );
  }

}

export default List;
