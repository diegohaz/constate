import React from "react";
import PropTypes from "prop-types";
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
    onBeforeUnmount: PropTypes.func
  };

  static defaultProps = {
    initialState: {}
  };

  constructor(props) {
    super(props);
    const { onInit, context } = props;
    if (!context && typeof onInit === "function") {
      const setState = (fn, cb) => {
        if (this.mounted) {
          return this.handleSetState(fn, cb);
        }
        this.state = { ...this.state, ...fn(this.state) };
        return cb && cb();
      };
      onInit({ state: this.state, setState });
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
    const { context, onBeforeUnmount } = this.props;
    this.mounted = false;
    if (!context && typeof onBeforeUnmount === "function") {
      onBeforeUnmount({ state: this.state, setState: () => {} });
    }
  }

  mounted = false;

  handleSetState = (fn, cb) => {
    const prevState = this.state;

    this.setState(fn, () => {
      const { onUpdate } = this.props;
      if (typeof onUpdate === "function") {
        onUpdate({
          state: this.state,
          prevState,
          setState: f => this.setState(f)
        });
      }
      if (cb) cb();
    });
  };

  render() {
    if (this.props.context) {
      return <Consumer {...this.props} />;
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
