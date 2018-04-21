import React from "react";
import PropTypes from "prop-types";
import Consumer from "./Consumer";
import { mapStateToActions, mapStateToSelectors } from "./utils";

class State extends React.Component {
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

  handleSetState = (...args) => this.setState(...args);

  render() {
    if (this.props.context) {
      return <Consumer {...this.props} />;
    }

    const { children, actions, selectors, effects } = this.props;
    const effectsArg = { state: this.state, setState: this.handleSetState };

    return children({
      ...this.state,
      ...(actions && mapStateToActions(this.handleSetState, actions)),
      ...(selectors && mapStateToSelectors(this.state, selectors)),
      ...(effects && mapStateToSelectors(effectsArg, effects))
    });
  }
}

export default State;
