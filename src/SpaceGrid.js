'use strict';

import React, { Component } from 'react';
import {Responsive, WidthProvider} from 'react-grid-layout';
import SpaceItem from './SpaceItem';
import {Glyphicon} from 'react-bootstrap';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class SpaceGrid extends Component {
  constructor(props) {
    super(props);
  }

  // We're using the cols coming back from this to calculate where to add new items.
  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    });
  }

  onLayoutChange(layout) {
    console.log('Layout change', layout);
    this.props.onLayoutChange(layout);
  }

  render() {
    return (
      <div>
        <ResponsiveReactGridLayout 
          draggableHandle=".drag-item" 
          onLayoutChange={this.onLayoutChange.bind(this)} 
          onBreakpointChange={this.onBreakpointChange}
          {...this.props}
        >
          {this.props.selectedSpaces.map((el) => {
            return (
              <div key={el.i} data-grid={el} style={{background:'gray'}}>
                <div 
                  title="Move space"
                  className="space-item-action drag-item"
                >
                  <Glyphicon glyph="fullscreen" />
                </div>
                <div 
                  title="Remove space"
                  className="space-item-action delete-item"
                  onClick={this.props.onRemoveSpace.bind(this, el.i)}
                >
                  <Glyphicon glyph="trash" />
                </div>
                <SpaceItem accessToken={this.props.accessToken} data={el} />
              </div>
            )
          })}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
};

SpaceGrid.defaultProps = {
  className: 'layout',
  cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}
};

export default SpaceGrid;
