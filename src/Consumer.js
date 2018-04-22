import React from "react";
import PropTypes from "prop-types";
import Context from "./Context";
import { mapSetStateToActions, mapArgumentToFunctions } from "./utils";

class ConsumerChild extends React.Component {
  static propTypes = {
    initialState: PropTypes.object,
    state: PropTypes.object.isRequired,
    setState: PropTypes.func.isRequired,
    actions: PropTypes.objectOf(PropTypes.func),
    selectors: PropTypes.objectOf(PropTypes.func),
    effects: PropTypes.objectOf(PropTypes.func),
    children: PropTypes.func.isRequired,
    context: PropTypes.string
  };

  constructor(props) {
    super(props);
    const { context, initialState, setState } = this.props;
    setState(state => ({
      [context]: { ...initialState, ...state[context] }
    }));
  }

  handleSetState = fn => {
    const { setState, context } = this.props;
    return setState(state => ({
      [context]: { ...state[context], ...fn(state[context]) }
    }));
  };

  render() {
    const { context, children, actions, selectors, effects } = this.props;
    const state = this.props.state[context] || {};
    const effectsArg = { state, setState: this.handleSetState };

    return children({
      ...state,
      ...(actions && mapSetStateToActions(this.handleSetState, actions)),
      ...(selectors && mapArgumentToFunctions(state, selectors)),
      ...(effects && mapArgumentToFunctions(effectsArg, effects))
    });
  }
}

const Consumer = props => (
  <Context.Consumer>
    {context => <ConsumerChild {...context} {...props} />}
  </Context.Consumer>
);

export default Consumer;
