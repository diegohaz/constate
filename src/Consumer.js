/* eslint-disable react/prop-types */
import React from "react";
import Context from "./Context";
import { mapSetStateToActions, mapArgumentToFunctions } from "./utils";

class ConsumerChild extends React.Component {
  // não pode ficar aqui. tem que ficar no provider como state
  // ou deixar no próprio state mesmo
  // counter1: { initialized: 2, mounted: 2 }
  static all = [];
  static initialized = [];
  static mounted = [];

  constructor(props) {
    super(props);
    const { state, context, initialState, onInit } = this.props;
    if (!state[context]) {
      this.handleSetState(
        prevState => ({ ...initialState, ...prevState }),
        () => {
          if (
            typeof onInit === "function" &&
            ConsumerChild.initialized.indexOf(context) < 0
          ) {
            onInit({
              state: this.props.state[context],
              setState: this.handleSetState
            });
            ConsumerChild.initialized.push(context);
          }
        },
        false
      );
    } else if (
      typeof onInit === "function" &&
      ConsumerChild.initialized.indexOf(context) < 0
    ) {
      onInit({
        state: state[context],
        setState: this.handleSetState
      });
      ConsumerChild.initialized.push(context);
    }
  }

  componentDidMount() {
    const { context, onMount, state, initialState } = this.props;
    if (
      typeof onMount === "function" &&
      ConsumerChild.mounted.indexOf(context) < 0
    ) {
      onMount({
        state: { ...initialState, ...state[context] },
        setState: this.handleSetState
      });
      ConsumerChild.mounted.push(context);
    }
    ConsumerChild.all.push(context);
  }

  componentWillUnmount() {
    const { state, context, onBeforeUnmount } = this.props;
    const index = ConsumerChild.all.indexOf(context);
    ConsumerChild.all.splice(index, 1);
    console.log(ConsumerChild.all);
    if (
      ConsumerChild.all.indexOf(context) < 0 &&
      typeof onBeforeUnmount === "function"
    ) {
      onBeforeUnmount({
        state: state[context],
        setState: (fn, cb) => this.handleSetState(fn, cb, false)
      });
    }
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
