import React from "react";
import PropTypes from "prop-types";
import Context from "./Context";
import Consumer from "./Consumer";
import { mapSetStateToActions, mapArgumentToFunctions } from "./utils";

class Container extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    initialState: PropTypes.object,
    actions: PropTypes.objectOf(PropTypes.func),
    selectors: PropTypes.objectOf(PropTypes.func),
    effects: PropTypes.objectOf(PropTypes.func),
    context: PropTypes.string,
    onInit: PropTypes.func,
    onMount: PropTypes.func,
    onUpdate: PropTypes.func,
    onUnmount: PropTypes.func
  };

  static defaultProps = {
    initialState: {}
  };

  constructor(...args) {
    super(...args);
    const { context, onInit } = this.props;
    if (!context && typeof onInit === "function") {
      onInit({ state: this.state, setState: this.handleSetState });
    }
  }

  state = this.props.initialState;

  componentDidMount() {
    const { context, onMount } = this.props;
    this.mounted = true;
    if (!context && typeof onMount === "function") {
      onMount({ state: this.state, setState: this.handleSetState });
    }
  }

  componentWillUnmount() {
    const { context, onUnmount } = this.props;
    this.mounted = false;
    if (!context && typeof onUnmount === "function") {
      onUnmount({ state: this.state, setState: () => {} });
    }
  }

  mounted = false;

  handleSetState = (fn, cb) => {
    const prevState = this.state;

    const callOnUpdate = () => {
      const { onUpdate } = this.props;
      if (typeof onUpdate === "function") {
        onUpdate({
          prevState,
          state: this.state,
          setState: (...args) => this.setState(...args)
        });
      }
    };

    if (!this.mounted) {
      this.state = {
        ...this.state,
        ...fn(this.state)
      };
      callOnUpdate();
      if (cb) cb();
      return;
    }

    this.setState(fn, () => {
      callOnUpdate();
      if (cb) cb();
    });
  };

  render() {
    if (this.props.context) {
      return (
        <Context.Consumer>
          {state => <Consumer {...state} {...this.props} />}
        </Context.Consumer>
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
