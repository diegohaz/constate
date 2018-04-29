/* eslint-disable react/sort-comp, react/no-unused-state */
import React from "react";
import PropTypes from "prop-types";
import Context from "./Context";

class Provider extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    initialState: PropTypes.object
  };

  static defaultProps = {
    initialState: {}
  };

  handleSetState = (fn, cb) => {
    this.setState(
      state => ({
        state: {
          ...state.state,
          ...fn(state.state)
        }
      }),
      cb
    );
  };

  state = {
    state: this.props.initialState,
    setState: this.handleSetState
    // consumers: { counter1: [Object] }
    // setConsumers
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
