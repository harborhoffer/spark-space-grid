import React, { Component } from 'react';
import cookie from 'react-cookies';
import {Button} from 'react-bootstrap';

import {
  CLIENT_ID,
  AUTH_URL,
  AUTH_SCOPES,
  LAST_STATE_COOKIE
} from './constants';

class Authorize extends Component {
  authorize() {
    const state = Math.floor((Math.random() * 1000) + 1);
    
    let expires = new Date();
    expires.setSeconds(expires.getSeconds() + 120);
    
    cookie.save(LAST_STATE_COOKIE, state, {
      path: '/',
      expires: expires
    });

    window.location.href = `${this.getAuthorizationUrl()}&state=${state}`;
  }

  getAuthorizationUrl() {
    const redirectUri = encodeURIComponent(`${window.location.protocol}//${window.location.host}`);
    const scope = encodeURIComponent(AUTH_SCOPES);

    return `${AUTH_URL}?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${redirectUri}&scope=${scope}`;
  }

  render() {
    return (
      <div className="text-center" style={{marginTop:'100px'}}>
        <Button bsStyle="primary" bsSize="large" onClick={this.authorize.bind(this)}>Login With Spark</Button>
      </div>
    );
  }
}

export default Authorize;
