/* eslint-disable react/sort-comp, react/no-unused-state */
import React from "react";
import Context from "./Context";
import { parseUpdater } from "./utils";

class Provider extends React.Component {
  static defaultProps = {
    initialState: {}
  };

  containers = {};

  mount = (context, onMount) => {
    if (!this.containers[context]) {
      this.containers[context] = 0;
      if (onMount) this.setState(null, onMount);
    }
    this.containers[context] += 1;

    return onUnmount => {
      if (this.containers[context] === 1 && onUnmount) onUnmount();
      this.containers[context] -= 1;
    };
  };

  getContextState = (context, state = this.state) => state.state[context];

  setContextState = context => (updater, callback) => {
    const updaterFn = state => ({
      [context]: {
        ...state[context],
        ...parseUpdater(updater, state[context])
      }
    });
    this.handleSetState(updaterFn, callback);
  };

  handleSetState = (updater, callback) => {
    const updaterFn = state => ({
      state: {
        ...state.state,
        ...parseUpdater(updater, state.state)
      }
    });
    this.setState(updaterFn, callback);
  };

  state = {
    state: this.props.initialState,
    setState: this.handleSetState,
    mount: this.mount,
    getContextState: this.getContextState,
    setContextState: this.setContextState
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
