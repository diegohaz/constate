// @flow
/* eslint-disable react/sort-comp, react/no-unused-state, no-underscore-dangle */
import React from "react";
import Context from "./Context";
import { parseUpdater } from "./utils";

/*::
import type { SetContextState, GetArgs,
  ProviderState, ProviderProps, MountContainer } from "./types";

type REDUX_DEVTOOLS = {
  disconnect: () => void,
  unsubscribe: () => void,
  init: (mixed) => void,
  subscribe: (mixed) => void,
  send: (devtoolsType: string, val: mixed) => void
}

type REDUX_DEVTOOLS_EXTENSION = {
  connect: (mixed) => REDUX_DEVTOOLS
}
*/

// $FlowFixMe
const reduxDevtoolsExtension /*: REDUX_DEVTOOLS_EXTENSION*/ =
  typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION__;

class Provider extends React.Component /*:: <ProviderProps, ProviderState>*/ {
  devtools /*: ?REDUX_DEVTOOLS*/ = undefined;
  containers /*: {[string]: number}*/ = {};

  static defaultProps = {
    initialState: {}
  };

  constructor(props /*: ProviderProps*/) {
    super(props);
    const { initialState } = props;
    // istanbul ignore next
    if (props.devtools && reduxDevtoolsExtension) {
      const devtools = reduxDevtoolsExtension.connect({ name: "Context" });
      devtools.init(initialState);
      devtools.subscribe(message => {
        if (message.type === "DISPATCH" && message.state) {
          this.setState(state => ({
            state: { ...state.state, ...JSON.parse(message.state) }
          }));
        }
      });
      this.devtools = devtools;
    }
  }

  componentDidMount() {
    const { onMount } = this.props;
    if (onMount) {
      onMount(this.getArgs({}, "Provider/onMount"));
    }
  }

  componentWillUnmount() {
    const { onUnmount } = this.props;
    if (onUnmount) {
      const { setContextState, ...args } = this.getArgs();
      onUnmount(args);
    }
    // istanbul ignore next
    if (this.devtools) {
      this.devtools.unsubscribe();
      reduxDevtoolsExtension.disconnect();
    }
  }

  mountContainer /*: MountContainer*/ = (context, onMount) => {
    if (!this.containers[context]) {
      this.containers[context] = 0;
      if (onMount) this.setState(null, onMount);
    }
    this.containers[context] += 1;

    return (onUnmount /*: (mixed) => void*/) => {
      if (this.containers[context] === 1 && onUnmount) onUnmount();
      this.containers[context] -= 1;
    };
  };

  setContextState /*: SetContextState*/ = (
    context,
    updater,
    callback,
    type
  ) => {
    let prevState;

    const updaterFn = state => {
      prevState = state.state;
      return {
        state: {
          ...state.state,
          [context]: {
            ...state.state[context],
            ...parseUpdater(updater, state.state[context] || {})
          }
        }
      };
    };

    const callbackFn = () => {
      const { onUpdate } = this.props;
      if (onUpdate) {
        const additionalArgs = { prevState, context, type };
        const args = this.getArgs(additionalArgs, "Provider/onUpdate");
        onUpdate(args);
      }
      if (callback) callback();
      // istanbul ignore next
      if (this.devtools && type) {
        const devtoolsType = context ? `${context}/${type}` : type;
        this.devtools.send(devtoolsType, this.state.state);
      }
    };

    this.setState(updaterFn, callbackFn);
  };

  state = {
    state: this.props.initialState,
    mountContainer: this.mountContainer,
    setContextState: this.setContextState
  };

  getArgs /*: GetArgs*/ = (additionalArgs, type) => {
    const { state, setContextState } = this.state;
    return {
      state,
      setContextState: (ctx, u, c) => setContextState(ctx, u, c, type),
      ...additionalArgs
    };
  };

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export default Provider;
