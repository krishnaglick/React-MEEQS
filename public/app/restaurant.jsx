
import React, { Component } from 'react';
const { Button, Select, Rating } = require('stardust');
const _ = require('lodash');
const searcher = require('./searcher');

/* globals $ */

class Restaurant extends Component {

  constructor(props) {
    super(props);
    this.state = {
      menu: props.menu || 0,
      efficiency: props.efficiency || 0,
      environment : props.environment || 0,
      quality: props.quality || 0,
      service: props.service || 0,
      value: props.value || '',
      options: [],
      isFetching: false
    };

    this.options = [];
    this.isFetching = false;

    this.searcher = new searcher();
    this.rate = this.rate.bind(this);
    this.restaurantSelected = this.restaurantSelected.bind(this);
    this.search = this.search.bind(this);

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
    try {
      this.setState({ isFetching: true });
      const name = value;
      const data = await this.searcher
      .setLocation(this.props.loc.lat, this.props.loc.long)
      .loadLocations({name});
      const foundRestaurants = {options: _.map(data, (v, i) => {
        return {
          text: v.name,
          value: i,
          id: v.id,
          place_id: v.place_id,
          location: v.geometry.location.toString().replace(/(\(|\))/g, '')
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
      const rating = _.merge(this.state, this.state.options[this.state.value]);
      await $.post('../api/rate', rating);
    }
    catch(x) {
      console.log('bad!', x);
    }
  }

  render() {
    const { options, isFetching, value } = this.state;

    return (
      <div className="ui form segment">
        <div className="field">
          <div id="map" />
        </div>
        <div className="field">
          <Select
            options={options}
            disabled={isFetching}
            loading={isFetching}
            search={true}
            onChange={this.restaurantSelected}
            onSearchChange={this.search}
            value={value}
            placeholder='Name of Restaurant'
          />
        </div>
        <div className="field">
          Menu: 
          <Rating icon='star' defaultRating={0} maxRating={4} onRate={this.rateMenu} />
        </div>
        <div className="field">
          Efficiency: 
          <Rating icon='star' defaultRating={0} maxRating={4} onRate={this.rateEfficiency} />
        </div>
        <div className="field">
          Environment: 
          <Rating icon='star' defaultRating={0} maxRating={4} onRate={this.rateEnvironment} />
        </div>
        <div className="field">
          Quality: 
          <Rating icon='star' defaultRating={0} maxRating={4} onRate={this.rateQuality} />
        </div>
        <div className="field">
          Service: 
          <Rating icon='star' defaultRating={0} maxRating={4} onRate={this.rateService} />
        </div>
        <Button onClick={this.rate}>
          Rate
        </Button>
      </div>
    );
  }

}

export default Restaurant;
