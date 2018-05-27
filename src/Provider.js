/* eslint-disable react/sort-comp, react/no-unused-state */
import React from "react";
import Context from "./Context";
import { parseUpdater } from "./utils";

class Provider extends React.Component {
  static defaultProps = {
    initialState: {}
  };

  componentDidMount() {
    if (this.props.onMount) {
      this.props.onMount(this.getArgs({}, "onMount"));
    }
  }

  componentWillUnmount() {
    if (this.props.onUnmount) {
      const { setState, setContextState, ...args } = this.getArgs();
      this.props.onUnmount(args);
    }
  }

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

  setContextState = context => (updater, callback, type) => {
    const updaterFn = state => ({
      [context]: {
        ...state[context],
        ...parseUpdater(updater, state[context])
      }
    });
    this.handleSetState(updaterFn, callback, type, context);
  };

  handleSetState = (updater, callback, type, context) => {
    let prevState;

    this.setState(
      state => {
        prevState = state.state;
        return {
          state: {
            ...state.state,
            ...parseUpdater(updater, state.state)
          }
        };
      },
      () => {
        if (this.props.onUpdate) {
          const args = this.getArgs({ prevState, context, type }, "onUpdate");
          this.props.onUpdate(args);
        }
        if (callback) callback();
      }
    );
  };

  state = {
    state: this.props.initialState,
    setState: this.handleSetState,
    mount: this.mount,
    getContextState: this.getContextState,
    setContextState: this.setContextState
  };

  getArgs = (additionalArgs, setStateType) => {
    const { mount, setState, setContextState, ...args } = this.state;
    return {
      setState: (u, c) => setState(u, c, setStateType),
      setContextState: ctx => (u, c) =>
        setContextState(ctx)(u, c, setStateType),
      ...args,
      ...additionalArgs
    };
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
