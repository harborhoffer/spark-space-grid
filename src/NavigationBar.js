import React from 'react';
import PropTypes from 'prop-types';

import {
  Navbar, 
  Nav,
  NavItem
} from 'react-bootstrap';

function NavigationBar(props) {
  function handleAddSpacesClick() {
    props.onAddSpacesClick();
  }

  function handleLogoutClick(evt) {
    evt.preventDefault();
    props.onLogoutClick();
  }

  return (
    <Navbar fixedTop inverse collapseOnSelect fluid>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="#">Spark Space Grid</a>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <NavItem eventKey={1} href="#" onClick={handleAddSpacesClick}>Add Spaces</NavItem>
        </Nav>
        <Nav pullRight>
          <NavItem eventKey={1} href="#" onClick={handleLogoutClick}>Logout</NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

NavigationBar.propTypes = {
  onLogoutClick: PropTypes.func,
  onAddSpacesClick: PropTypes.func
}

export default NavigationBar;