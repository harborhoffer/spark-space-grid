'use strict';

import React, { Component } from 'react';
import {Responsive, WidthProvider} from 'react-grid-layout';
import SpaceItem from './SpaceItem';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

/**
 * This layout demonstrates how to use a grid with a dynamic number of elements.
 */
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
    //this.setState({layout: layout});
    //console.log('Layout change', layout);
  }

  render() {
    return (
      <div>
        <ResponsiveReactGridLayout onLayoutChange={this.onLayoutChange.bind(this)} onBreakpointChange={this.onBreakpointChange}
            {...this.props}>
          {this.props.selectedSpaces.map((el) => {
            return (
              <div key={el.i} data-grid={el} style={{background:'gray'}}>
                <div 
                  style={{
                    backgroundColor: '#CCC',
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    width: 15,
                    height: 15,
                    textAlign: 'center',
                    lineHeight: '15px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    zIndex: 1000
                  }}
                  onClick={this.props.onRemoveSpace.bind(this, el.i)}
                >
                  x
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
