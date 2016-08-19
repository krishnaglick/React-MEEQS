
import React, { Component } from 'react';
import { Button, Card } from 'stardust';

class Restaurant extends Component {

  constructor(props) {
    super(props);
    this.state = {
      location: props.location.vicinity,
      name: props.location.name,
      place_id: props.location.place_id
    };

    this.rate = this.rate.bind(this);
  }

  rate() {
    //Things here
  }

  render() {
    const { name, location } = this.state;

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
          <Button onClick={this.rate}>
            Rate
          </Button>
        </Card.Content>
      </Card>
    );
  }

}

export default Restaurant;
