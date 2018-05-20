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
    if (!context && onMount) {
      onMount(this.getArgs());
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { context, onUpdate } = this.props;
    if (!context && onUpdate && prevState !== this.state) {
      onUpdate(this.getArgs({ prevState }));
    }
  }

  componentWillUnmount() {
    const { context, onUnmount } = this.props;
    if (!context && onUnmount) {
      onUnmount(this.getArgs({ setState: () => {} }));
    }
  }

  getArgs = additionalArgs => ({
    state: this.state,
    setState: this.handleSetState,
    ...additionalArgs
  });

  handleSetState = this.setState.bind(this);

  render() {
    if (this.props.context) {
      return (
        <Consumer>
          {state => <ContextContainer {...state} {...this.props} />}
        </Consumer>
      );
    }

    const { children, actions, selectors, effects } = this.props;

    return children({
      ...this.state,
      ...(actions && mapSetStateToActions(this.handleSetState, actions)),
      ...(selectors && mapArgumentToFunctions(this.state, selectors)),
      ...(effects && mapArgumentToFunctions(this.getArgs(), effects))
    });
  }
}

export default Container;
