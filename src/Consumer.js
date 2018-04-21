import React from "react";
import PropTypes from "prop-types";
import Context from "./Context";
import {
  mapStateToActions,
  mapStateToSelectors,
  mapStateToEffects
} from "./utils";

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
    const { context, children } = this.props;
    const state = this.props.state[context] || {};

    const actions =
      this.props.actions &&
      mapStateToActions(this.handleSetState, this.props.actions);

    const selectors =
      this.props.selectors && mapStateToSelectors(state, this.props.selectors);

    const effects =
      this.props.effects &&
      mapStateToEffects(
        { state, setState: this.handleSetState },
        this.props.effects
      );

    return children({
      ...state,
      ...actions,
      ...selectors,
      ...effects
    });
  }
}

const Consumer = props => (
  <Context.Consumer>
    {context => <ConsumerChild {...context} {...props} />}
  </Context.Consumer>
);

export default Consumer;
