import React from "react";
import PropTypes from "prop-types";
import Consumer from "./Consumer";
import { mapStateToActions, mapStateToSelectors } from "./utils";

/**
 * @class State
 * @prop {Function} children
 * @prop {Object=} initialState
 * @prop {Object=} actions
 * @prop {Object=} selectors
 * @prop {String=} context
 */
class State extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    initialState: PropTypes.object,
    actions: PropTypes.objectOf(PropTypes.func),
    selectors: PropTypes.objectOf(PropTypes.func),
    context: PropTypes.string
  };

  static defaultProps = {
    initialState: {}
  };

  state = this.props.initialState;

  onSetState = (...args) => this.setState(...args);

  render() {
    if (this.props.context) {
      return <Consumer {...this.props} />;
    }

    const { children, actions, selectors } = this.props;

    return children({
      ...this.state,
      ...(actions && mapStateToActions(this.onSetState, actions)),
      ...(selectors && mapStateToSelectors(this.state, selectors))
    });
  }
}

export default State;
