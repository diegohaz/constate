import React from "react";
import {
  mapSetStateToActions,
  mapArgumentToFunctions,
  parseUpdater
} from "./utils";

class ContextContainer extends React.Component {
  constructor(...args) {
    super(...args);
    const { setContextState, context, initialState } = this.props;
    setContextState(
      context,
      state => ({ ...initialState, ...state }),
      undefined,
      "initialState"
    );
  }

  componentDidMount() {
    const { mount, context, onMount } = this.props;
    this.unmount = mount(
      context,
      onMount && (() => onMount(this.getArgs({}, "onMount")))
    );
  }

  componentWillUnmount() {
    const { onUnmount } = this.props;
    this.unmount(onUnmount && (() => onUnmount(this.getArgs({}, "onUnmount"))));
  }

  getArgs = (additionalArgs, setStateType) => {
    const { getContextState, context } = this.props;
    return {
      state: getContextState(context),
      setState: (u, c) => this.handleSetState(u, c, setStateType),
      ...additionalArgs
    };
  };

  handleSetState = (updater, callback, type) => {
    const { setContextState, context, onUpdate } = this.props;
    const setState = (...args) => setContextState(context, ...args);
    let prevState;

    setState(
      state => {
        prevState = state;
        return parseUpdater(updater, state);
      },
      () => {
        if (onUpdate) onUpdate(this.getArgs({ prevState, type }, "onUpdate"));
        if (callback) callback();
      },
      type
    );
  };

  render() {
    const { children, actions, selectors, effects } = this.props;
    const { state } = this.getArgs();
    return children({
      ...state,
      ...(actions && mapSetStateToActions(this.handleSetState, actions)),
      ...(selectors && mapArgumentToFunctions(state, selectors)),
      ...(effects && mapArgumentToFunctions(this.getArgs, effects))
    });
  }
}

export default ContextContainer;
