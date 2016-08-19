
import React, { Component } from 'react';
import { Button, Select, Rating } from 'stardust';
import _ from 'lodash';
import searcher from './searcher';

/* globals $ */

class Rater extends Component {

  constructor(props) {
    super(props);
    this.state = {
      menu: props.menu || 0,
      efficiency: props.efficiency || 0,
      environment : props.environment || 0,
      quality: props.quality || 0,
      service: props.service || 0,
      isFetching: false,
      location: '',
      options: props.options ? _.isArray(props.options) ? props.options : [props.options] : [],

      text: props.name ? `${props.name} - ${props.location}` : '',
      value: props.name ? `${props.name} - ${props.location}` :  props.value || '',
      name: props.name || ''
    };

    this.props.hasLoc.then((location) => {
      this.searcher = new searcher(location);
      this.setState({ location });
    });

    this.rate = this.rate.bind(this);
    this.cancel = this.props.cancel;
    this.restaurantSelected = this.restaurantSelected.bind(this);

    this.search = _.debounce(this.search.bind(this), 1000);

    this.updateRating = this.updateRating.bind(this);

    this.rateMenu = (e, { rating }) => {
      this.updateRating('menu', rating);
    };
    this.rateEfficiency = (e, { rating }) => {
      this.updateRating('efficiency', rating);
    };
    this.rateEnvironment = (e, { rating }) => {
      this.updateRating('environment', rating);
    };
    this.rateQuality = (e, { rating }) => {
      this.updateRating('quality', rating);
    };
    this.rateService = (e, { rating }) => {
      this.updateRating('service', rating);
    };
  }

  async search(event, value) {
    if(!value) return;
    try {
      this.setState({ isFetching: true });
      const name = value;
      const data = await this.searcher
      .loadLocations({name});
      const foundRestaurants = {options: _.map(data, (v) => {
        return {
          text: `${v.name} - ${v.vicinity}`,
          value: `${v.name} - ${v.vicinity}`,
          name: v.name,
          id: v.id,
          place_id: v.place_id,
          vicinity: v.vicinity || v.location
        };
      })};
      this.setState(foundRestaurants);
    }
    catch(x) {
      console.log('Error finding google data!', x);
    }
    this.setState({ isFetching: false });
  }

  restaurantSelected(e, value) {
    this.setState({ value });
  }

  updateRating(type, value) {
    const updater = {};
    updater[type] = value;
    this.setState(updater);
  }

  async rate() {
    try {
      const selectionData = _.filter(this.state.options, (o) => `${o.name} - ${o.vicinity || o.vicinity}` === this.state.value)[0];
      if(!selectionData)
        throw `No matching restaurant, something's screwy!`;
      const rating = _.mergeWith({}, this.state, selectionData);
      delete rating.options;
      delete rating.photos;
      delete rating.html_attributions;
      delete rating.geometry;
      await $.post('../api/rate', rating);
    }
    catch(x) {
      console.log('Issue rating a restaurant!', x);
    }
  }

  render() {
    const { options, isFetching, value } = this.state;

    return (
      <div className="ui form segment">
        <div className="field">
          {(() => {
            if(this.state.name)
              return (<div>{this.state.name}</div>);
            else {
              return (
                <Select
                  options={options}
                  disabled={isFetching}
                  loading={isFetching}
                  search={true}
                  onChange={this.restaurantSelected}
                  onSearchChange={this.search}
                  value={value}
                  placeholder={'Search for a Restaurant!'}
                />
              );
            }
          })()}
        </div>
        <div className="field">
          Menu: 
          <Rating icon='star'clearable={true} defaultRating={0} maxRating={4} onRate={this.rateMenu} />
        </div>
        <div className="field">
          Efficiency: 
          <Rating icon='star'clearable={true} defaultRating={0} maxRating={4} onRate={this.rateEfficiency} />
        </div>
        <div className="field">
          Environment: 
          <Rating icon='star'clearable={true} defaultRating={0} maxRating={4} onRate={this.rateEnvironment} />
        </div>
        <div className="field">
          Quality: 
          <Rating icon='star'clearable={true} defaultRating={0} maxRating={4} onRate={this.rateQuality} />
        </div>
        <div className="field">
          Service: 
          <Rating icon='star'clearable={true} defaultRating={0} maxRating={4} onRate={this.rateService} />
        </div>
        <Button onClick={this.rate} className="ui green button">
          Rate
        </Button>
        <Button onClick={this.cancel} className="ui red button">
          Cancel
        </Button>
      </div>
    );
  }

}

export default Rater;
