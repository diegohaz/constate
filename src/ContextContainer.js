/* eslint-disable react/prop-types */
import React from "react";
import { mapSetStateToActions, mapArgumentToFunctions } from "./utils";

class ContextContainer extends React.Component {
  constructor(...args) {
    super(...args);
    const { state, context } = this.props;
    if (!state[context]) {
      this.handleSetState(this.getState, undefined, false);
    }
  }

  componentDidMount() {
    const { context, onMount, getMounted, mount } = this.props;
    if (!getMounted(context) && typeof onMount === "function") {
      onMount(this.getArgs());
    }
    mount(context);
  }

  componentWillUnmount() {
    const { getMounted, unmount, context, onUnmount } = this.props;
    if (getMounted(context) === 1 && typeof onUnmount === "function") {
      onUnmount(this.getArgs());
    }
    unmount(context);
  }

  getArgs = additionalArgs => ({
    state: this.getState(),
    setState: this.handleSetState,
    ...additionalArgs
  });

  getState = (state = this.props.state[this.props.context]) => ({
    ...this.props.initialState,
    ...state
  });

  handleSetState = (fn, cb, emitUpdate = true) => {
    const { context, onUpdate, setState } = this.props;
    const prevState = this.getState();

    const updater = state => ({
      [context]: {
        ...this.getState(state[context]),
        ...fn(this.getState(state[context]))
      }
    });

    const callback = () => {
      if (emitUpdate && typeof onUpdate === "function") {
        onUpdate(this.getArgs({ prevState }));
      }
      if (cb) cb();
    };

    setState(updater, callback);
  };

  render() {
    const { children, actions, selectors, effects } = this.props;
    return children({
      ...this.getState(),
      ...(actions && mapSetStateToActions(this.handleSetState, actions)),
      ...(selectors && mapArgumentToFunctions(this.getState(), selectors)),
      ...(effects && mapArgumentToFunctions(this.getArgs(), effects))
    });
  }
}

export default ContextContainer;
