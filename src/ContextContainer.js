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
    setContextState(context)(state => ({ ...initialState, ...state }));
  }

  componentDidMount() {
    const { mount, context, onMount } = this.props;
    this.unmount = mount(context, onMount && (() => onMount(this.getArgs())));
  }

  componentWillUnmount() {
    const { onUnmount } = this.props;
    this.unmount(onUnmount && (() => onUnmount(this.getArgs())));
  }

  getArgs = additionalArgs => {
    const { getContextState, context } = this.props;
    return {
      state: getContextState(context),
      setState: this.handleSetState,
      ...additionalArgs
    };
  };

  handleSetState = (updater, callback) => {
    const { setContextState, context, onUpdate } = this.props;
    const setState = setContextState(context);
    let prevState;

    setState(
      state => {
        prevState = state;
        return parseUpdater(updater, state);
      },
      () => {
        if (onUpdate) onUpdate(this.getArgs({ prevState }));
        if (callback) callback();
      }
    );
  };

  render() {
    const { children, actions, selectors, effects } = this.props;
    const args = this.getArgs();
    return children({
      ...args.state,
      ...(actions && mapSetStateToActions(args.setState, actions)),
      ...(selectors && mapArgumentToFunctions(args.state, selectors)),
      ...(effects && mapArgumentToFunctions(args, effects))
    });
  }
}

export default ContextContainer;
