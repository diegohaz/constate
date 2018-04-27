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
    const { state, context, initialState } = this.props;
    if (!state[context]) {
      this.handleSetState(prevState => ({ ...initialState, ...prevState }));
    }
  }

  getMethodsArg = () => ({
    state: this.props.state[this.props.context] || {},
    setState: this.handleSetState
  });

  handleSetState = fn => {
    const { setState, context } = this.props;
    return setState(state => ({
      [context]: { ...state[context], ...fn(state[context]) }
    }));
  };

  render() {
    const { children, actions, selectors, effects } = this.props;
    const { state, setState } = this.getMethodsArg();

    return children({
      ...state,
      ...(actions && mapSetStateToActions(setState, actions)),
      ...(selectors && mapArgumentToFunctions(state, selectors)),
      ...(effects && mapArgumentToFunctions({ state, setState }, effects))
    });
  }
}

const Consumer = props => (
  <Context.Consumer>
    {context => <ConsumerChild {...context} {...props} />}
  </Context.Consumer>
);

export default Consumer;
