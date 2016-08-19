
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
      rateMode: false
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
    const { name, location, place_id } = this.state;

    if(this.state.rateMode) {
      return <Rater
        name={name}
        location={location}
        vicinity={location}
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
              if(this.state.location) {
                return (
                  <Button onClick={this.rate}>
                    Rate
                  </Button>
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
