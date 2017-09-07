import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Modal, Button} from 'react-bootstrap';
import Select from 'react-select';
import {find, filter} from 'lodash';

import 'react-select/dist/react-select.css';

class AddSpaceModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedSpaces: [],
    }
  }

  handleAddClick(spaces) {
    this.props.onAddSpaces(spaces);
  }

  getSpaces() {
    const {
      spaces,
      activeSpaces
    } = this.props;

    // Sort spaces by last active date
    const sortedSpaces = spaces.sort(
      (date1, date2) => new Date(date2.lastActivity) - new Date(date1.lastActivity)
    );

    const filteredSpaces = filter(sortedSpaces, (space) => {
      if ( !find(activeSpaces, {'i': space.id}) ) {
        return space;
      }
    });
    
    return filteredSpaces.map((space) => {
      return {value:space.id, label:space.title};
    });
  }

  setSelectedSpaces(val) {
    this.setState({
      selectedSpaces: val
    });
  }

  handleAddClick() {
    this.props.onAddSpaces(this.state.selectedSpaces);
    this.hideModal();
  }

  hideModal() {
    this.setState({
      selectedSpaces: []
    });

    this.props.hide();
  }

  render() {
    const {
      onAddSpaces
    } = this.props;

    const spaces = this.getSpaces();

    return (
      <Modal show={this.props.show} backdrop={true}>
        <Modal.Header>
          <Modal.Title>Add Spark Spaces</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Select
            name="spaces"
            multi={true}
            simpleValue={true}
            value={this.state.selectedSpaces}
            options={spaces}
            onChange={this.setSelectedSpaces.bind(this)}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.hideModal.bind(this)}>Close</Button>
          <Button bsStyle="primary" onClick={this.handleAddClick.bind(this)}>Add Selected Spaces</Button>
        </Modal.Footer>

      </Modal>
    );
  }
}

AddSpaceModal.propTypes = {
  spaces: PropTypes.array,
  activeSpaces: PropTypes.array,
  onAddSpaces: PropTypes.func
}

export default AddSpaceModal;