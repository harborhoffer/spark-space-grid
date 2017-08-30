import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Modal, Button} from 'react-bootstrap';
import {toast} from 'react-toastify';

import 'react-select/dist/react-select.css';

class SaveLayoutModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
    }

    this.hideModal = this.hideModal.bind(this);
  }

  handleSaveClick() {
    const name = this.state.name.trim();
    const layoutExists = this.props.layouts[name];

    if (layoutExists) {
      return toast.warn('A layout with that name already exists');
    }

    this.props.onSaveLayout(name);
    this.hideModal();
  }

  hideModal() {
    this.setState({
      name: ''
    });

    this.props.hide();
  }

  render() {
    return (
      <Modal show={this.props.show} backdrop={true}>
        <Modal.Header>
          <Modal.Title>New Layout</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Layout name</label>
              <input 
                type="text" 
                className="form-control" 
                value={this.state.name}
                onChange={(e) => this.setState({name: e.target.value})}
              />
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.hideModal.bind(this)}>Close</Button>
          <Button bsStyle="primary" onClick={this.handleSaveClick.bind(this)}>Save Layout</Button>
        </Modal.Footer>

      </Modal>
    );
  }
}

SaveLayoutModal.propTypes = {
  onSaveLayout: PropTypes.func,
  layouts: PropTypes.object,
  show: PropTypes.bool,
  hide: PropTypes.func
}

export default SaveLayoutModal;