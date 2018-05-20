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

  componentDidUpdate(_, prevState) {
    const contexts = Object.keys(this.updaters);
    contexts.forEach(context => {
      const prevContextState = this.getContextState(context, prevState);
      const contextState = this.getContextState(context);
      if (prevContextState && prevContextState !== contextState) {
        const [updater] = this.updaters[context];
        if (updater) updater(prevContextState);
      }
    });
  }

  containers = {};
  updaters = {};

  subscribe = (context, onMount, onUpdate) => {
    if (!this.containers[context]) {
      this.containers[context] = 0;
      if (onMount) {
        this.setState(null, onMount);
      }
    }

    this.containers[context] += 1;

    if (!this.updaters[context]) {
      this.updaters[context] = [];
    }

    let updaterIndex = -1;

    if (onUpdate) {
      updaterIndex = this.updaters[context].length;
      this.updaters[context].push(onUpdate);
    }

    return onUnmount => {
      if (this.containers[context] === 1 && onUnmount) {
        onUnmount();
      }

      this.containers[context] -= 1;

      if (updaterIndex !== -1) {
        this.setState(null, () => {
          this.updaters[context].splice(updaterIndex, 1);
        });
      }
    };
  };

  getContextState = (context, state = this.state) => state.state[context];

  setContextState = context => (fn, cb) => {
    const updater = state => ({
      [context]: {
        ...state[context],
        ...fn(state[context])
      }
    });
    this.handleSetState(updater, cb);
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
    subscribe: this.subscribe,
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
