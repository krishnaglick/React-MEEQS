
import React, { Component } from 'react';
const { Input, Button, Select } = require('stardust');
const _ = require('lodash');
const searcher = require('./searcher');

class Restaurant extends Component {

  constructor(props) {
    super(props);
    this.state = {
      menu: props.menu || 0,
      efficiency: props.efficiency || 0,
      environment : props.environment || 0,
      quality: props.quality || 0,
      service: props.service || 0,
      name: [props.name] || [''],
      options: [],
      isFetching: false
    };

    this.options = [];
    this.isFetching = false;

    this.searcher = new searcher();
    this.rate = this.rate.bind(this);
    this.search = this.search.bind(this);
    this.nameSearch = (event) => {
      event.persist();
      _.debounce(this.search, 1000).call(this, event);
    };
  }

  async search(event) {
    try {
      this.setState({ isFetching: true });
      const name = event.target.value;
      const data = await this.searcher
        .setLocation(this.props.loc.lat, this.props.loc.long)
        .loadLocations({name});
      //debugger;
      //this.props.locations = data;
      const o = {options: _.map(data, (v) => {
        return { text: v.name, value: v.id };
      })};
      debugger;
      this.setState(o);
      //console.log(data);
    }
    catch(x) {
      console.log('Error finding google data!', x);
    }
    this.setState({ isFetching: false });
  }

  rate() {
    console.log('Rate!');
  }

  render() {
    return (
      <div className="ui form segment">
        <div className="field">
          <div id="map" />
        </div>
        <div className="field">
          <Select
            options={this.options}
            loading={this.isFetching}
            search={true}
            onSearchChange={this.nameSearch}
            value={this.props.name}
            placeholder='Name of Restaurant'
          />
        </div>
        <div className="field">
          <Input value={this.props.menu} placeholder='Menu' />
        </div>
        <div className="field">
          <Input value={this.props.efficiency} placeholder='Efficiency' />
        </div>
        <div className="field">
          <Input value={this.props.environment} placeholder='Environment' />
        </div>
        <div className="field">
          <Input value={this.props.quality} placeholder='Quality' />
        </div>
        <div className="field">
          <Input value={this.props.service} placeholder='Service' />
        </div>
        <Button onClick={this.rate}>
          Rate
        </Button>
      </div>
    );
  }

}

export default Restaurant;
