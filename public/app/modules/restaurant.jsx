
import React, { Component } from 'react';
import { Button, Card } from 'stardust';
import Rater from './rater.jsx';

class Restaurant extends Component {

  constructor(props) {
    super(props);
    this.state = {
      location: props.location.vicinity,
      name: props.location.name,
      place_id: props.location.place_id,
      rateMode: false,

      menu: props.menu || 0,
      efficiency: props.efficiency || 0,
      environment : props.environment || 0,
      quality: props.quality || 0,
      service: props.service || 0,
    };

    this.rate = this.rate.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  rate() {
    this.setState({rateMode: true});
  }
  cancel() {
    this.setState({rateMode: false});
  }

  render() {
    const { name, location, place_id, rateMode } = this.state;

    if(rateMode) {
      return <Rater
        hasLoc={this.props.hasLoc}
        name={name}
        location={location}
        place_id={place_id}
        cancel={this.cancel}
        options={this.props.location}
      />;
    }
    else {
      return (
        <Card>
          <Card.Content>
            <Card.Header>
              {name}
            </Card.Header>
            <Card.Meta>
              {location}
            </Card.Meta>
          </Card.Content>
          <Card.Content extra>
            {(() => {
              if(location) {
                return (
                  <div>
                    Menu: {this.state.menu} | Efficiency: {this.state.efficiency} | Environment: {this.state.environment} | Quality: {this.state.quality} | Service: {this.state.service}
                    <Button onClick={this.rate}>
                      Rate
                    </Button>
                  </div>
              );
              }
            })()}
          </Card.Content>
        </Card>
      );
    }
  }

}

export default Restaurant;
