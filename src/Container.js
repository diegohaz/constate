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
    context: PropTypes.string
  };

  static defaultProps = {
    initialState: {}
  };

  state = this.props.initialState;

  getMethodsArg = () => ({
    state: this.state,
    setState: this.handleSetState
  });

  handleSetState = (...args) => this.setState(...args);

  render() {
    if (this.props.context) {
      return <Consumer {...this.props} />;
    }

    const { children, actions, selectors, effects } = this.props;

    return children({
      ...this.state,
      ...(actions && mapSetStateToActions(this.handleSetState, actions)),
      ...(selectors && mapArgumentToFunctions(this.state, selectors)),
      ...(effects && mapArgumentToFunctions(this.getMethodsArg(), effects))
    });
  }
}

export default Container;
