/* eslint-disable react/prop-types */
import React from "react";
import { mapSetStateToActions, mapArgumentToFunctions } from "./utils";

class ContextContainer extends React.Component {
  constructor(...args) {
    super(...args);
    const {
      getContextState,
      setContextState,
      context,
      initialState
    } = this.props;
    if (!getContextState(context)) {
      setContextState(context)(state => ({ ...initialState, ...state }));
    }
  }

  componentDidMount() {
    const { subscribe, context, onMount, onUpdate } = this.props;

    this.unsubscribe = subscribe(
      context,
      onMount && (() => onMount(this.getArgs())),
      onUpdate && (prevState => onUpdate(this.getArgs({ prevState })))
    );
  }

  componentWillUnmount() {
    const { onUnmount } = this.props;
    this.unsubscribe(onUnmount && (() => onUnmount(this.getArgs())));
  }

  getArgs = additionalArgs => {
    const { getContextState, setContextState, context } = this.props;
    return {
      state: getContextState(context),
      setState: setContextState(context),
      ...additionalArgs
    };
  };

  render() {
    const {
      context,
      children,
      actions,
      selectors,
      effects,
      getContextState,
      setContextState
    } = this.props;

    const state = getContextState(context);
    const setState = setContextState(context);

    return children({
      ...state,
      ...(actions && mapSetStateToActions(setState, actions)),
      ...(selectors && mapArgumentToFunctions(state, selectors)),
      ...(effects && mapArgumentToFunctions(this.getArgs(), effects))
    });
  }
}

export default ContextContainer;
