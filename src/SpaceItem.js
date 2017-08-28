import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SpaceItem extends Component {

  componentDidMount() {
    window.ciscospark.widget(this.spaceEl).spaceWidget({
      accessToken: this.props.accessToken,
      spaceId: this.props.data.i
    });
  }

  componentWillUnmount() {
    window.ciscospark.widget(this.spaceEl).remove();
  }

  render() {
    return (
      <div ref={(el) => { this.spaceEl = el; }} />
    );
  }
}

SpaceItem.propTypes = {
  data: PropTypes.object,
  accessToken: PropTypes.string
}

export default SpaceItem;
