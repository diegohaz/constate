import React from "react";
import {
  mapSetStateToActions,
  mapArgumentToFunctions,
  parseUpdater
} from "./utils";

class ContextContainer extends React.Component {
  constructor(props) {
    super(props);
    const { state, setContextState, context, initialState } = props;
    if (!state[context]) {
      setContextState(
        context,
        currentState => ({ ...initialState, ...currentState }),
        undefined,
        "initialState"
      );
    }
  }

  componentDidMount() {
    const { mountContainer, context, onMount } = this.props;
    this.unmount = mountContainer(
      context,
      onMount && (() => onMount(this.getArgs({}, "onMount")))
    );
  }

  shouldComponentUpdate(nextProps) {
    const { state } = this.props;
    const { context, shouldUpdate, state: nextState } = nextProps;
    if (shouldUpdate) {
      this.ignoreState = nextState[context];
      return shouldUpdate({
        state: state[context] || {},
        nextState: nextState[context]
      });
    }
    return true;
  }

  componentWillUnmount() {
    const { onUnmount } = this.props;
    this.unmount(onUnmount && (() => onUnmount(this.getArgs({}, "onUnmount"))));
  }

  getArgs = (additionalArgs, type) => {
    const { state, context } = this.props;
    return {
      state: state[context],
      setState: (u, c) => this.handleSetState(u, c, type),
      ...additionalArgs
    };
  };

  ignoreState = null;

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
        if (onUpdate && this.ignoreState !== this.props.state[context]) {
          onUpdate(this.getArgs({ prevState, type }, "onUpdate"));
        }
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
