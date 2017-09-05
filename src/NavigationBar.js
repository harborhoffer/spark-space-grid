import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import {
  Navbar, 
  Nav,
  NavItem,
  FormGroup,
  Glyphicon,
  Button
} from 'react-bootstrap';

function NavigationBar(props) {
  function handleAddSpacesClick() {
    props.onAddSpacesClick();
  }

  function handleLogoutClick(evt) {
    evt.preventDefault();
    props.onLogoutClick();
  }

  function handleSaveLayoutClick() {
    props.onSaveLayoutClick();
  }

  function handleDeleteLayoutClick() {
    if (!window.confirm('Are you sure you want to delete this layout?')) {
      return;
    }

    props.onDeleteLayoutClick();
  }

  function handleSetLayout(layout) {
    const selectedLayout = layout || '';
    props.onSetLayout(selectedLayout);
  }

  function getLayouts() {
    const layouts = Object.keys(props.layouts);

    return layouts.map((layout) => {
      return {value:layout, label:layout};
    });
  }

  return (
    <Navbar fixedTop collapseOnSelect fluid>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="#">Spark Space Grid</a>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        
        <Navbar.Form pullLeft>
          
          {
            props.selectedSpaces.length > 0 &&
            <FormGroup>
              <Button onClick={handleAddSpacesClick}>
                <Glyphicon glyph="plus-sign" /> Add Spaces
              </Button>
            </FormGroup>
          }

          {
            props.selectedLayout.length === 0 && 
            props.selectedSpaces.length > 0 &&
            <FormGroup>
              <Button onClick={handleSaveLayoutClick}>
                <Glyphicon glyph="floppy-disk" /> Save Layout
              </Button>
            </FormGroup>
          }

          {
            Object.keys(props.layouts).length > 0 &&
            <FormGroup style={{minWidth:'250px'}}>
              <Select
                name="layouts"
                placeholder="Layouts"
                autosize
                simpleValue
                value={props.selectedLayout}
                options={getLayouts()}
                onChange={handleSetLayout}
              />
            </FormGroup>
          }

          {
            props.selectedLayout.length > 0 &&
            <FormGroup>
              <Button onClick={handleDeleteLayoutClick}>
                <Glyphicon glyph="trash" /> Delete Layout
              </Button>
            </FormGroup>
          }

          {
            Object.keys(props.layouts).length > 0 &&
            props.selectedLayout.length > 0 &&
            <FormGroup>
              <Button onClick={() => window.location.reload()}>
                <Glyphicon glyph="plus" /> Create a New Layout
              </Button>
            </FormGroup>
          }
        </Navbar.Form>

        <Nav pullRight>
          <NavItem eventKey={1} href="#" onClick={handleLogoutClick}>Logout</NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

NavigationBar.propTypes = {
  onLogoutClick: PropTypes.func,
  onAddSpacesClick: PropTypes.func,
  onSaveLayoutClick: PropTypes.func,
  onDeleteLayoutClick: PropTypes.func,
  onSetLayout: PropTypes.func,
  layouts: PropTypes.object,
  selectedSpaces: PropTypes.array,
  selectedLayout: PropTypes.string
}

export default NavigationBar;