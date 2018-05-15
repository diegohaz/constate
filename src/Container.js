import React from "react";
import PropTypes from "prop-types";
import Consumer from "./Consumer";
import ContextContainer from "./ContextContainer";
import { mapSetStateToActions, mapArgumentToFunctions } from "./utils";

class Container extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    initialState: PropTypes.object,
    actions: PropTypes.objectOf(PropTypes.func),
    selectors: PropTypes.objectOf(PropTypes.func),
    effects: PropTypes.objectOf(PropTypes.func),
    context: PropTypes.string,
    onMount: PropTypes.func,
    onUpdate: PropTypes.func,
    onUnmount: PropTypes.func
  };

  static defaultProps = {
    initialState: {}
  };

  state = this.props.initialState;

  componentDidMount() {
    const { context, onMount } = this.props;
    if (!context && typeof onMount === "function") {
      onMount({ state: this.state, setState: this.handleSetState });
    }
  }

  componentWillUnmount() {
    const { context, onUnmount } = this.props;
    if (!context && typeof onUnmount === "function") {
      onUnmount({ state: this.state, setState: () => {} });
    }
  }

  handleSetState = (fn, cb) => {
    const prevState = this.state;

    this.setState(fn, () => {
      if (typeof this.props.onUpdate === "function") {
        this.props.onUpdate({
          prevState,
          state: this.state,
          setState: this.handleSetState
        });
      }
      if (cb) cb();
    });
  };

  render() {
    if (this.props.context) {
      return (
        <Consumer>
          {state => <ContextContainer {...state} {...this.props} />}
        </Consumer>
      );
    }

    const { children, actions, selectors, effects } = this.props;
    const effectsArg = { state: this.state, setState: this.handleSetState };

    return children({
      ...this.state,
      ...(actions && mapSetStateToActions(this.handleSetState, actions)),
      ...(selectors && mapArgumentToFunctions(this.state, selectors)),
      ...(effects && mapArgumentToFunctions(effectsArg, effects))
    });
  }
}

export default Container;
