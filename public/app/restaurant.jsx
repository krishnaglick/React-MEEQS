
import React, { Component } from 'react';
const { Input, Button, Select } = require('stardust');
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
      name: props.name || '',
      options: [],
      isFetching: false
    };

    this.options = [];
    this.isFetching = false;

    this.searcher = new searcher();
    this.rate = this.rate.bind(this);
    this.restaurantSelected = this.restaurantSelected.bind(this);
    this.search = this.search.bind(this);
  }

  async search(event, value) {
    try {
      this.setState({ isFetching: true });
      const name = value;
      const data = await this.searcher
      .setLocation(this.props.loc.lat, this.props.loc.long)
      .loadLocations({name});
      const foundRestaurants = {options: _.map(data, (v) => {
        return { text: v.name, value: v.name };
      })};
      this.setState(foundRestaurants);
    }
    catch(x) {
      console.log('Error finding google data!', x);
    }
    this.setState({ isFetching: false });
  }

  restaurantSelected(e, value) {
    this.setState({ name: value });
  }

  async rate() {
    try {
      await $.post('../api/rate', this.state);
    }
    catch(x) {
      console.log('bad!', x);
    }
  }

  render() {
    const { options, isFetching, name } = this.state;

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
            value={name}
            placeholder='Name of Restaurant'
          />
        </div>
        <div className="field">
          <Input value={this.props.menu} type="number" placeholder='Menu' />
        </div>
        <div className="field">
          <Input value={this.props.efficiency} type="number" placeholder='Efficiency' />
        </div>
        <div className="field">
          <Input value={this.props.environment} type="number" placeholder='Environment' />
        </div>
        <div className="field">
          <Input value={this.props.quality} type="number" placeholder='Quality' />
        </div>
        <div className="field">
          <Input value={this.props.service} type="number" placeholder='Service' />
        </div>
        <Button onClick={this.rate}>
          Rate
        </Button>
      </div>
    );
  }

}

export default Restaurant;
