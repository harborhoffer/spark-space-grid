import React, { Component } from 'react';
import cookie from 'react-cookies';
import PropTypes from 'prop-types';
import {API_URL, ACCESS_TOKEN_COOKIE} from './constants';
import {Button} from 'react-bootstrap';
import {reject} from 'lodash';

import SpaceGrid from './SpaceGrid';
import AddSpaceModal from './AddSpaceModal';
import NavigationBar from './NavigationBar';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      spaces: [],
      layouts: [],
      loadingSpaces: true,
      selectedSpaces: [],
      showAddSpacesModal: false
    }

    this.onAddSpaces = this.onAddSpaces.bind(this);
  }

  componentDidMount() {
    this.loadSpaces();
  }

  loadSpaces() {
    const {accessToken} = this.props;
    const request = new Request(`${API_URL}/rooms?sortBy=id&max=1000`, {
      method: 'GET', 
      mode: 'cors', 
      redirect: 'follow',
      headers: new Headers({
        'Authorization': `Bearer ${accessToken}`
      })
    });

    fetch(request)
    .then((res) => {
      if (res.status >= 200 && res.status < 300) {
        return Promise.resolve(res);
      } else {
        return Promise.reject(res);
      }
    })
    .then((res) => {
      return res.json().catch((err) => Promise.reject(err));
    })
    .then((spaces) => {
      this.setState({
        loadingSpaces: false,
        spaces: spaces.items
      });
    })
    .catch((err) => {
      console.log('Error fetching rooms', err);
    })
  }

  addSpaces(e) {
    if (e) e.preventDefault();

    this.setState({
      showAddSpacesModal: true
    });
  }

  onAddSpaces(spaces) {
    const spaceArray = spaces.split(',');

    const newSpaces = spaceArray.map((space, index) => {
      return {
        i: space,
        x: (this.state.selectedSpaces.length + (index+1)) * 3 % 12,
        y: Infinity, // puts it at the bottom
        w: 3,
        h: 2,
        minW: 3, 
        minH: 3
      }
    });

    this.setState({
      selectedSpaces: this.state.selectedSpaces.concat(newSpaces)
    });
  }

  onRemoveSpace(space) {
    this.setState({
      selectedSpaces: reject(this.state.selectedSpaces, {i: space})
    });
  }

  onLogoutClick() {
    cookie.remove(ACCESS_TOKEN_COOKIE, { path: '/' });
    window.location.reload();
  }

  hideAddSpacesModal() {
    this.setState({
      showAddSpacesModal: false
    });
  }

  render() {
    const {
      spaces, 
      layouts, 
      loadingSpaces, 
      selectedSpaces, 
      showAddSpacesModal
    } = this.state;

    return (
      <div>
        {
          !loadingSpaces &&
          <NavigationBar 
            onLogoutClick={this.onLogoutClick.bind(this)}
            onAddSpacesClick={this.addSpaces.bind(this)}
          />
        }

        {
          loadingSpaces &&
          <div className="text-center" style={{marginTop:'100px'}}>
            <h3>Loading Spark Spaces...</h3>
          </div>
        }

        {
          !loadingSpaces && selectedSpaces.length === 0 &&
          <div className="text-center" style={{marginTop:'100px'}}>
            <Button bsStyle="primary" bsSize="large" onClick={this.addSpaces.bind(this)}>No Spaces. Add some</Button>
          </div>
        }

        {
          !loadingSpaces && selectedSpaces.length > 0 &&
          <div style={{marginTop:'55px'}}>
            <SpaceGrid 
              {...this.props}
              selectedSpaces={selectedSpaces}
              onRemoveSpace={this.onRemoveSpace.bind(this)}
            />
          </div>
        }

        <AddSpaceModal 
          show={spaces.length > 0 && !loadingSpaces && showAddSpacesModal}
          hide={this.hideAddSpacesModal.bind(this)}
          spaces={spaces}
          activeSpaces={selectedSpaces}
          onAddSpaces={this.onAddSpaces}
        />
      </div>
    );
  }
}

Main.propTypes = {
  accessToken: PropTypes.string
}

export default Main;
