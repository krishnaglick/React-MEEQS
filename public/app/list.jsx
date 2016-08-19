
import React, { Component } from 'react';
import Restaurant from './modules/restaurant.jsx';
import searcher from './modules/searcher';
import _ from 'lodash';

/* globals $, ForEac */

class List extends Component {

  constructor(props) {
    super(props);

    this.state = {
      locations: []
    };

    this.searcher = new searcher();
    this.loadRestaurants = this.loadRestaurants.bind(this);

    if(!this.props.loc.lat) {
      let finder = setInterval(() => {
        if(this.props.loc.lat) {
          this.loadRestaurants();
          clearInterval(finder);
        }
      }, 500);
    }
  }

  async loadRestaurants() {
    try {
      const locations = await this.searcher
      .setLocation(this.props.loc.lat, this.props.loc.long)
      .loadLocations();
      console.log(locations);
      //debugger;
      this.setState({locations});
    }
    catch(x) {
      console.log('Error loading restaurants for list!', x);
    }
  }

  render() {
    const { locations } = this.state;

    return (
      <div className="ui form segment">
        {_.map(locations, (location) => {
          return (
            <div className="field" key={location.id}>
              <Restaurant location={location} />
            </div>
          );
        })
        }
      </div>
    );
  }

}

export default List;
