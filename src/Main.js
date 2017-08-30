import React, { Component } from 'react';
import cookie from 'react-cookies';
import PropTypes from 'prop-types';
import localforage from 'localforage';
import {Button, Glyphicon} from 'react-bootstrap';
import {reject} from 'lodash';
import { ToastContainer, toast } from 'react-toastify';
import {
  API_URL, 
  ACCESS_TOKEN_COOKIE,
  APP_NAME
} from './constants';

import SpaceGrid from './SpaceGrid';
import AddSpaceModal from './AddSpaceModal';
import SaveLayoutModal from './SaveLayoutModal';
import NavigationBar from './NavigationBar';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      spaces: [],
      profile: null,
      layouts: {},
      loadingSpaces: true,
      selectedSpaces: [],
      selectedLayout: '',
      showAddSpacesModal: false,
      showSaveLayoutModal: false
    }

    this.onAddSpaces = this.onAddSpaces.bind(this);
    this.setProfile = this.setProfile.bind(this);
    this.initializeProfile = this.initializeProfile.bind(this);
    this.setLayout = this.setLayout.bind(this);
    this.getProfileKey = this.getProfileKey.bind(this);
    this.deleteLayout = this.deleteLayout.bind(this);
  }

  componentDidMount() {
    localforage.config({
      name: 'spark-space-grid'
    });
    this.loadData();
  }

  loadData() {
    const {accessToken} = this.props;

    const fetchOk = (...args) => fetch(...args)
      .then(res => res.ok ? res : res.json().then(data => {
        throw Object.assign(new Error(data.error_message), {name: res.statusText});
      }));

    Promise.all([
      `${API_URL}/rooms?sortBy=id&max=1000`,
      `${API_URL}/people/me`
    ].map(url => fetchOk(url, {
      method: 'GET', 
      mode: 'cors', 
      headers: new Headers({
        'Authorization': `Bearer ${accessToken}`
      })
    })
    .then(r => r.json()))).then(([spaces, profile]) => {
      this.setState({
        loadingSpaces: false,
        spaces: spaces.items,
        profile: profile
      });

      this.setProfile();
    }).catch(e => toast.error('Error loading spark spaces'));

  }

  setProfile() {
    const profileKey = this.getProfileKey();

    localforage.getItem(profileKey).then((value) => {
      if (!value) {
        return this.initializeProfile();
      }

      this.setState({
        layouts: value
      });
    }).catch((err) => {
      toast.error('Error loading layouts');
    });
  }

  initializeProfile() {
    const profileKey = this.getProfileKey();
    const profile = {};

    localforage.setItem(profileKey, profile).catch((err) => {
      toast.error('Error setting profile');
    });
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
        minH: 2
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

  onSaveLayout(name) {
    this.setLayout(name);
  }

  onSaveLayoutClick() {
    this.setState({
      showSaveLayoutModal: true
    });
  }

  onDeleteLayoutClick() {
    this.deleteLayout();
  }

  onSetLayout(layout) {
    this.setState({
      selectedLayout: layout,
      selectedSpaces: layout.length > 0 ? this.state.layouts[layout] : []
    });
  }

  setLayout(layoutName) {
    const profileKey = this.getProfileKey();
    const layout = layoutName || this.state.selectedLayout;

    let profile = this.state.layouts;
        profile[layout] = this.state.selectedSpaces;

    localforage.setItem(profileKey, profile).then(() => {
      this.setState({
        layouts: profile,
        selectedLayout: layout
      });

      if (layoutName) {
        toast.success('New layout created!');
      }
    }).catch(function (err) {
      toast.error('Could not save layout');
    });
  }

  deleteLayout() {
    const profileKey = this.getProfileKey();
    const layout = this.state.selectedLayout;

    let profile = this.state.layouts;
    delete profile[layout];

    localforage.setItem(profileKey, profile).then(() => {
      this.setState({
        layouts: profile,
        selectedSpaces: [],
        selectedLayout: ''
      });

      toast.success('Layout removed');
    }).catch(function (err) {
      toast.error('Could not remove layout');
    });
  }

  onLayoutChange(layout) {
    this.setState({
      selectedSpaces: layout,
    }, () => {
      // A layout is open
      if (this.state.selectedLayout.length > 0) {
        this.setLayout();
      }
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

  hideAddLayoutModal() {
    this.setState({
      showSaveLayoutModal: false
    });
  }

  getProfileKey() {
    return `profile-${this.state.profile.id}`;
  }

  render() {
    const {
      spaces, 
      layouts, 
      loadingSpaces, 
      selectedSpaces,
      selectedLayout, 
      showAddSpacesModal,
      showSaveLayoutModal
    } = this.state;

    return (
      <div>
         <ToastContainer 
          position="top-right"
          type="default"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          toastClassName="app-toast"
          closeOnClick
          pauseOnHover
        />

        {
          !loadingSpaces &&
          <NavigationBar 
            onLogoutClick={this.onLogoutClick.bind(this)}
            onAddSpacesClick={this.addSpaces.bind(this)}
            onSaveLayoutClick={this.onSaveLayoutClick.bind(this)}
            onDeleteLayoutClick={this.onDeleteLayoutClick.bind(this)}
            onSetLayout={this.onSetLayout.bind(this)}
            selectedSpaces={selectedSpaces}
            selectedLayout={selectedLayout}
            layouts={layouts}
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
            <h4>Your grid is empty</h4>
            <Button bsStyle="primary" bsSize="large" onClick={this.addSpaces.bind(this)}>
              <Glyphicon glyph="plus-sign" /> Add some spaces
            </Button>
          </div>
        }

        {
          !loadingSpaces && selectedSpaces.length > 0 &&
          <div style={{marginTop:'55px'}}>
            <SpaceGrid 
              {...this.props}
              selectedSpaces={selectedSpaces}
              onRemoveSpace={this.onRemoveSpace.bind(this)}
              onLayoutChange={this.onLayoutChange.bind(this)}
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

        <SaveLayoutModal 
          show={showSaveLayoutModal}
          hide={this.hideAddLayoutModal.bind(this)}
          layouts={this.state.layouts}
          onSaveLayout={this.onSaveLayout.bind(this)}
        />
      </div>
    );
  }
}

Main.propTypes = {
  accessToken: PropTypes.string
}

export default Main;
