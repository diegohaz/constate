// @flow
/* eslint-disable arrow-body-style */
import React from "react";
import Consumer from "./Consumer";
import ContextContainer from "./ContextContainer";
import {
  mapSetStateToActions,
  mapArgumentToFunctions,
  parseUpdater
} from "./utils";

/*::
import type {
  Action, Selector, Effect, RenderProp, HandleSetState,
  ContainerProps, ContainerState, GetArgs
} from "./types";
*/

class Container extends React.Component /*:: <ContainerProps, ContainerState>*/ {
  static defaultProps = {
    initialState: {}
  };

  state = this.props.initialState;

  componentDidMount() {
    const { context, onMount } = this.props;
    if (!context && onMount) {
      onMount(this.getArgs({}, "onMount"));
    }
  }

  shouldComponentUpdate(
    nextProps /*: ContainerProps*/,
    nextState /*: ContainerState*/
  ) {
    const { context, shouldUpdate } = this.props;
    if (!context && shouldUpdate) {
      const couldUpdate = shouldUpdate({ state: this.state, nextState });
      this.ignoreState = !couldUpdate && nextState;
      return couldUpdate;
    }
    return true;
  }

  componentWillUnmount() {
    const { context, onUnmount } = this.props;
    if (!context && onUnmount) {
      onUnmount(this.getArgs({ setState: () => {} }));
    }
  }

  getArgs /*: GetArgs*/ = (additionalArgs, type) => ({
    state: this.state,
    setState: (u, c) => this.handleSetState(u, c, type),
    ...additionalArgs
  });

  ignoreState = null;

  handleSetState /*: HandleSetState*/ = (updater, callback, type) => {
    let prevState;

    this.setState(
      state => {
        prevState = state;
        return parseUpdater(updater, state);
      },
      () => {
        const { onUpdate } = this.props;
        if (onUpdate && this.ignoreState !== this.state) {
          onUpdate(this.getArgs({ prevState, type }, "onUpdate"));
        }
        if (callback) callback();
      }
    );
  };

  render() {
    if (this.props.context) {
      return (
        <Consumer>
          {props => {
            // $FlowFixMe
            return <ContextContainer {...props} {...this.props} />;
          }}
        </Consumer>
      );
    }

    const { children, actions, selectors, effects } = this.props;

    return children({
      ...this.state,
      ...(actions && mapSetStateToActions(this.handleSetState, actions)),
      ...(selectors && mapArgumentToFunctions(this.state, selectors)),
      ...(effects && mapArgumentToFunctions(this.getArgs, effects))
    });
  }
}

export default Container;
