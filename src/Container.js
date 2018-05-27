import React from "react";
import Consumer from "./Consumer";
import ContextContainer from "./ContextContainer";
import {
  mapSetStateToActions,
  mapArgumentToFunctions,
  parseUpdater
} from "./utils";

class Container extends React.Component {
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

  componentWillUnmount() {
    const { context, onUnmount } = this.props;
    if (!context && onUnmount) {
      onUnmount(this.getArgs({ setState: () => {} }));
    }
  }

  getArgs = (additionalArgs, setStateType) => ({
    state: this.state,
    setState: (u, c) => this.handleSetState(u, c, setStateType),
    ...additionalArgs
  });

  handleSetState = (updater, callback, type) => {
    let prevState;

    this.setState(
      state => {
        prevState = state;
        return parseUpdater(updater, state);
      },
      () => {
        if (this.props.onUpdate) {
          this.props.onUpdate(this.getArgs({ prevState, type }, "onUpdate"));
        }
        if (callback) callback();
      }
    );
  };

  render() {
    if (this.props.context) {
      return (
        <Consumer>
          {props => <ContextContainer {...props} {...this.props} />}
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
