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
    context: PropTypes.string
  };

  static defaultProps = {
    initialState: {}
  };

  state = this.props.initialState;

  changeState = (...args) => this.setState(...args);

  render() {
    if (this.props.context) {
      return <Consumer {...this.props} />;
    }

    const { children, actions, selectors } = this.props;

    return children({
      ...this.state,
      ...(actions && mapStateToActions(this.changeState, actions)),
      ...(selectors && mapStateToSelectors(this.state, selectors))
    });
  }
}

export default State;
