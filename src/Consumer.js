/* eslint-disable react/prop-types */
import React from "react";
import Context from "./Context";
import { mapSetStateToActions, mapArgumentToFunctions } from "./utils";

const initialized = (state, context) =>
  state.$initialized && state.$initialized[context];
const mounted = (state, context) => state.$mounted && state.$mounted[context];

class ConsumerChild extends React.Component {
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
      if (typeof onMount === "function" && !mounted(prevState, context)) {
        onMount({
          state: { ...initialState, ...prevState[context] },
          setState: this.handleSetState
        });
      }
      return {
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
    const { setState, context, onBeforeUnmount } = this.props;
    setState(prevState => {
      if (
        typeof onBeforeUnmount === "function" &&
        mounted(prevState, context) === 1
      ) {
        onBeforeUnmount({
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

const Consumer = props => (
  <Context.Consumer>
    {context => <ConsumerChild {...context} {...props} />}
  </Context.Consumer>
);

export default Consumer;
