import React, { Component } from 'react';
import cookie from 'react-cookies';

import {ACCESS_TOKEN_COOKIE, LAST_STATE_COOKIE} from './constants';

import Authorize from './Authorize';
import Main from './Main';

import './App.css';


class App extends Component {
  constructor() {
    super();

    this.state = {
      accessToken: this.getAccessToken()
    }
  }

  getAccessToken() {
    const token = cookie.load(ACCESS_TOKEN_COOKIE);
    const lastState = cookie.load(LAST_STATE_COOKIE);
    const hash = window.location.hash.substr(1);
    const parts = hash.split('&');
    const auth = {};

    if (token) return token;
    if (!hash || !lastState) return null;

    console.log('Hash', hash);

    parts.forEach(function(parts) {
      var p = parts.split('=');
      auth[p[0]] = p[1];
    });

    // Make sure states match
    if(lastState !== auth.state) {
      return null;
    }

    if (typeof(auth.access_token) === 'string') {
      // Reset the hash, so that token is no longer in URL
      window.location.hash = '';

      this.setAccessToken(auth);
      return auth.access_token;
    }

    return null;
  }

  setAccessToken(auth) {
    let expires = new Date();
    expires.setSeconds(expires.getSeconds() + parseInt(auth.expires_in));
    cookie.save(ACCESS_TOKEN_COOKIE, auth.access_token, { 
      path: '/', 
      expires 
    });
  }

  render() {
    const {accessToken} = this.state;

    if (!accessToken) {
      return <Authorize />
    }

    return <Main accessToken={accessToken} />
  }
}

export default App;
