/* eslint-disable react/prop-types */
import React from "react";
import { mapSetStateToActions, mapArgumentToFunctions } from "./utils";

class ContextContainer extends React.Component {
  constructor(...args) {
    super(...args);
    const { state, context } = this.props;
    if (!state[context]) {
      this.handleSetState(this.mergeState, undefined, false);
    }
  }

  componentDidMount() {
    const { context, onMount, getMounted, mount, state } = this.props;
    if (!getMounted(context) && typeof onMount === "function") {
      onMount({
        state: this.mergeState(state[context]),
        setState: this.handleSetState
      });
    }
    mount(context);
  }

  componentWillUnmount() {
    const { state, getMounted, unmount, context, onUnmount } = this.props;
    if (getMounted(context) === 1 && typeof onUnmount === "function") {
      onUnmount({
        state: this.mergeState(state[context]),
        setState: this.handleSetState
      });
    }
    unmount(context);
  }

  mergeState = state => ({ ...this.props.initialState, ...state });

  handleSetState = (fn, cb, emitUpdate = true) => {
    const { context, onUpdate, setState } = this.props;
    const prevState = this.props.state[context];

    const updater = state => ({
      [context]: {
        ...state[context],
        ...fn(state[context])
      }
    });

    const callback = () => {
      if (emitUpdate && typeof onUpdate === "function") {
        onUpdate({
          prevState,
          state: this.props.state[context],
          setState: this.handleSetState
        });
      }
      if (cb) cb();
    };

    setState(updater, callback);
  };

  render() {
    const {
      context,
      state,
      children,
      actions,
      selectors,
      effects
    } = this.props;

    const effectsArg = {
      state: state[context],
      setState: this.handleSetState
    };

    return children({
      ...state[context],
      ...(actions && mapSetStateToActions(this.handleSetState, actions)),
      ...(selectors && mapArgumentToFunctions(state[context], selectors)),
      ...(effects && mapArgumentToFunctions(effectsArg, effects))
    });
  }
}

export default ContextContainer;
