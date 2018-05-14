/* eslint-disable react/prop-types */
import React from "react";
import { mapSetStateToActions, mapArgumentToFunctions } from "./utils";

class Consumer extends React.Component {
  constructor(...args) {
    super(...args);
    const {
      state,
      getInitialized,
      init,
      context,
      initialState,
      onInit
    } = this.props;

    if (!getInitialized(context) && typeof onInit === "function") {
      onInit({
        state: { ...initialState, ...state[context] },
        setState: this.handleSetState
      });
    }
    init(context);

    if (!state[context]) {
      this.handleSetState(
        prevState => ({ ...initialState, ...prevState }),
        () => {},
        false
      );
    }
  }

  componentDidMount() {
    const {
      context,
      onMount,
      getMounted,
      mount,
      state,
      initialState
    } = this.props;

    if (!getMounted(context) && typeof onMount === "function") {
      onMount({
        state: { ...initialState, ...state[context] },
        setState: this.handleSetState
      });
    }
    mount(context);
  }

  componentWillUnmount() {
    const { state, getMounted, unmount, context, onUnmount } = this.props;
    if (getMounted(context) === 1 && typeof onUnmount === "function") {
      onUnmount({
        state: state[context],
        setState: this.handleSetState
      });
    }
    unmount(context);
  }

  handleSetState = (fn, cb, emitUpdate = true) => {
    const { context, onUpdate, initialState } = this.props;
    const prevState = { ...initialState, ...this.props.state[context] };
    const setState = (f, c) =>
      this.props.setState(
        state => ({
          [context]: {
            ...state[context],
            ...f({ ...initialState, ...state[context] })
          }
        }),
        c
      );

    if (emitUpdate) {
      return setState(fn, () => {
        if (typeof onUpdate === "function") {
          onUpdate({
            state: { ...initialState, ...this.props.state[context] },
            prevState,
            setState
          });
        }
        if (cb) cb();
      });
    }

    return setState(fn, cb);
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

export default Consumer;
