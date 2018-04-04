/* eslint-disable react/sort-comp, react/no-unused-state */
import React from "react";
import PropTypes from "prop-types";
import Context from "./Context";

/**
 * @class Provider
 * @prop {React.Node} children
 * @prop {Object=} initialState
 */
class Provider extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    initialState: PropTypes.object
  };

  static defaultProps = {
    initialState: {}
  };

  changeState = fn => {
    this.setState(state => ({
      state: fn(state.state)
    }));
  };

  state = {
    state: this.props.initialState,
    setState: this.changeState
  };

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export default Provider;
