/* eslint-disable react/prop-types */
import React from "react";
import { mapSetStateToActions, mapArgumentToFunctions } from "./utils";

const initialized = (state, context) =>
  state.$initialized && state.$initialized[context];
const mounted = (state, context) => state.$mounted && state.$mounted[context];

// CAN'T WRAP LIFECYCLE CALLS IN SETSTATE

// Warning: An update (setState, replaceState, or forceUpdate) was scheduled from
// inside an update function. Update functions should be pure, with zero side-effects.
// Consider using componentDidUpdate or a callback.

// AN OPTION IS TO USE SETSTATE CALLBACK AND
// INITIALIZED() SHOULD CHECK IF IT'S THE FIRST INITIALIZED (MAYBE A COUNTER OR INSTANCE)
// SAME FOR ONMOUNT
// UNMOUNT SHOULD DECREMENT OR REMOVE THE INSTANCE AND FINALLY CHECK IF THERE'S ZERO OR NO INSTANCE

class Consumer extends React.Component {
  constructor(props) {
    super(props);
    const { state, setState, context, initialState, onInit } = this.props;

    setState(prevState => {
      if (!initialized(prevState, context) && typeof onInit === "function") {
        onInit({
          state: { ...initialState, ...prevState[context] },
          setState: this.handleSetState
        });
        return {
          $initialized: { ...prevState.$initialized, [context]: true }
        };
      }
      return {};
    });

    if (!state[context]) {
      this.handleSetState(
        prevState => ({ ...initialState, ...prevState }),
        () => {},
        false
      );
    }
  }

  componentDidMount() {
    const { context, onMount, state, setState, initialState } = this.props;
    setState(prevState => {
      let foo;
      if (typeof onMount === "function" && !mounted(prevState, context)) {
        onMount({
          state: { ...initialState, ...prevState[context] },
          // can't use cb here
          // also needs to trigger onUpdate
          // IT'LL NOT WORK ON DELAYED DIDMOUNT
          setState: (fn, cb) => {
            foo = fn(prevState[context]);
          }
        });
      }
      return {
        [context]: {
          ...prevState[context],
          ...foo
        },
        $mounted: {
          ...prevState.$mounted,
          [context]: mounted(state, context)
            ? prevState.$mounted[context] + 1
            : 1
        }
      };
    });
  }

  componentWillUnmount() {
    const { setState, context, onUnmount } = this.props;
    setState(prevState => {
      if (
        typeof onUnmount === "function" &&
        mounted(prevState, context) === 1
      ) {
        onUnmount({
          state: prevState[context],
          setState: (fn, cb) => this.handleSetState(fn, cb, false)
        });
      }
      return {
        $mounted: {
          [context]: prevState.$mounted[context] - 1
        }
      };
    });
  }

  handleSetState = (fn, cb, emitUpdate = true) => {
    const { context, onUpdate, initialState } = this.props;
    const prevState = { ...initialState, ...this.props.state[context] };
    const setState = (f, c) =>
      this.props.setState(
        state => ({
          [context]: { ...state[context], ...f(state[context]) }
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
