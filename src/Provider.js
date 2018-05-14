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

  initialized = {};
  mounted = {};

  getInitialized = context => this.initialized[context] || 0;
  getMounted = context => this.mounted[context] || 0;

  init = context => {
    this.initialized[context] = this.getInitialized(context) + 1;
  };

  mount = context => {
    this.mounted[context] = this.getMounted(context) + 1;
  };

  unmount = context => {
    this.initialized[context] = this.getInitialized(context) - 1;
    this.mounted[context] = this.getMounted(context) - 1;
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
    setState: this.handleSetState,
    getInitialized: this.getInitialized,
    getMounted: this.getMounted,
    init: this.init,
    mount: this.mount,
    unmount: this.unmount
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
