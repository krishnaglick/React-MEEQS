
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
      this.setState({ locations });
      this.loadMeeqsRatingsForRestaurants();
    }
    catch(x) {
      console.log('Error loading restaurants for list!', x);
    }
  }

  async loadMeeqsRatingsForRestaurants() {
    try {
      const placeIDs = _.map(this.state.locations, (loc) => loc.place_id).join(',');
      const meeqsRatings = await $.post('../api/getRatingsForLocations', { placeIDs });
      const locations = _.map(this.state.locations, (location) => {
        const meeqsRating = _.find(meeqsRatings, (rating) => rating.place_id === location.place_id);
        if(meeqsRating) {
          _.forEach(['menu', 'efficiency', 'environment', 'quality', 'service'], (key) => {
            meeqsRating[key] = parseInt(meeqsRating[key]);
          });
          location.id += 'MEEQS';
        }
        return _.merge({}, location, meeqsRating);
      });
      this.setState({ locations });
    }
    catch(x) {
      console.error('Error loading MEEQS ratings for locations!', x);
    }
  }

  render() {
    const { locations } = this.state;

    const restaurants = _.map(locations, (location) => {
      return (
        <div className="field" key={location.id}>
          <Restaurant hasLoc={this.props.hasLoc} location={location} />
        </div>
      );
    });

    return (
      <div className="ui large form segment">
        <div className="ui two stackable cards">
          {restaurants}
        </div>
        <img src="./assets/images/google.png" />
      </div>
    );
  }

}

export default List;
