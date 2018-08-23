import * as React from "react";
import Consumer from "./Consumer";
import {
  mapSetStateToActions,
  mapStateToSelectors,
  parseUpdater,
  mapPropsToEffects
} from "./utils";
import {
  ContainerProps,
  EventKeys,
  EffectProps,
  SetStateWithType,
  StateUpdater,
  InnerContainerProps
} from "./types";

class InnerContainer<
  State,
  Actions = {},
  Selectors = {},
  Effects = {}
> extends React.Component<
  InnerContainerProps<State, Actions, Selectors, Effects>,
  State
> {
  static defaultProps = {
    initialState: {}
  };

  readonly state = this.props.initialState as State;

  private ignoreState: State | boolean = false;

  private unmount?: (onUnmount: () => void) => void = undefined;

  constructor(props: InnerContainerProps<State, Actions, Selectors, Effects>) {
    super(props);
    const { context, setContextState, state, initialState } = props;
    if (context && setContextState && !state) {
      setContextState(
        context,
        currentState => Object.assign({}, initialState, currentState),
        undefined,
        "initialState"
      );
    }
  }

  componentDidMount() {
    const { context, mountContainer, onMount } = this.props;
    const mount = () => onMount && onMount(this.getEffectProps("onMount"));

    if (context && mountContainer) {
      this.unmount = mountContainer(context, mount);
    } else if (!context) {
      mount();
    }
  }

  shouldComponentUpdate(
    nextProps: InnerContainerProps<State, Actions, Selectors, Effects>,
    nextState: State
  ) {
    const { context, state: stateFromProps } = this.props;
    const { state: nextStateFromProps, shouldUpdate } = nextProps;
    let couldUpdate = true;

    if (context && stateFromProps && nextStateFromProps && shouldUpdate) {
      couldUpdate = shouldUpdate({
        state: stateFromProps,
        nextState: nextStateFromProps
      });
      this.ignoreState = !couldUpdate && nextStateFromProps;
    } else if (!context && shouldUpdate) {
      couldUpdate = shouldUpdate({ state: this.state, nextState });
      this.ignoreState = !couldUpdate && nextState;
    }

    return couldUpdate;
  }

  componentWillUnmount() {
    const { context, onUnmount } = this.props;
    const unmount = () =>
      onUnmount && onUnmount(this.getEffectProps("onUnmount"));

    if (this.unmount) {
      this.unmount(unmount);
    } else if (!context) {
      unmount();
    }
  }

  getEffectProps = (
    type: keyof Actions | keyof Effects | EventKeys
  ): EffectProps<State> => {
    const { context, state } = this.props;
    return {
      state: context && state ? state : this.state,
      setState: (u, c) => this.handleSetState(u, c, type)
    };
  };

  handleSetState: SetStateWithType<
    State,
    keyof Actions | keyof Effects | EventKeys
  > = (updater, callback, type) => {
    const { context, setContextState } = this.props;
    let prevState: State;

    const updaterFn: StateUpdater<State> = state => {
      prevState = state;
      return parseUpdater(updater, state);
    };

    const callbackFn = () => {
      const { state = this.state, onUpdate } = this.props;
      if (onUpdate && this.ignoreState !== state) {
        onUpdate({
          ...this.getEffectProps("onUpdate"),
          prevState,
          type
        });
      }

      if (callback) callback();
    };

    if (context && setContextState) {
      setContextState(context, updaterFn, callbackFn, type);
    } else {
      // @ts-ignore
      this.setState(updaterFn, callbackFn);
    }
  };

  render() {
    const { state, children, actions, selectors, effects } = this.props;

    const childrenProps = Object.assign(
      {},
      state || this.state,
      actions && mapSetStateToActions(this.handleSetState, actions),
      selectors && mapStateToSelectors(state || this.state, selectors),
      effects && mapPropsToEffects<State, Effects>(this.getEffectProps, effects)
    );

    return children(childrenProps);
  }
}

// eslint-disable-next-line react/prefer-stateless-function, react/no-multi-comp
class Container<
  State,
  Actions = {},
  Selectors = {},
  Effects = {}
> extends React.Component<ContainerProps<State, Actions, Selectors, Effects>> {
  render() {
    const { context } = this.props;
    if (typeof context !== "undefined") {
      return (
        <Consumer>
          {({ state, setContextState, mountContainer }) => (
            <InnerContainer
              {...this.props}
              state={state[context]}
              setContextState={setContextState}
              mountContainer={mountContainer}
            />
          )}
        </Consumer>
      );
    }
    return <InnerContainer {...this.props} />;
  }
}

export default Container;
