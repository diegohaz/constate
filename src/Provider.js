/* eslint-disable react/sort-comp, react/no-unused-state, no-underscore-dangle */
import React from "react";
import Context from "./Context";
import { parseUpdater } from "./utils";

const reduxDevtoolsExtension =
  typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION__;

class Provider extends React.Component {
  static defaultProps = {
    initialState: {}
  };

  constructor(props) {
    super(props);
    this.containers = {};
    const { devtools, initialState } = props;
    // istanbul ignore next
    if (devtools && reduxDevtoolsExtension) {
      this.devtools = reduxDevtoolsExtension.connect({ name: "Context" });
      this.devtools.init(initialState);
      this.devtools.subscribe(message => {
        if (message.type === "DISPATCH" && message.state) {
          this.setState(state => ({
            state: { ...state.state, ...JSON.parse(message.state) }
          }));
        }
      });
    }
  }

  componentDidMount() {
    if (this.props.onMount) {
      this.props.onMount(this.getArgs({}, "Provider/onMount"));
    }
  }

  componentWillUnmount() {
    if (this.props.onUnmount) {
      const { setContextState, ...args } = this.getArgs();
      this.props.onUnmount(args);
    }
    // istanbul ignore next
    if (this.devtools) {
      this.devtools.unsubscribe();
      reduxDevtoolsExtension.disconnect();
    }
  }

  mountContainer = (context, onMount) => {
    if (!this.containers[context]) {
      this.containers[context] = 0;
      if (onMount) this.setState(null, onMount);
    }
    this.containers[context] += 1;

    return onUnmount => {
      if (this.containers[context] === 1 && onUnmount) onUnmount();
      this.containers[context] -= 1;
    };
  };

  setContextState = (context, updater, callback, type) => {
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
      if (this.props.onUpdate) {
        const additionalArgs = { prevState, context, type };
        const args = this.getArgs(additionalArgs, "Provider/onUpdate");
        this.props.onUpdate(args);
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

  getArgs = (additionalArgs, type) => {
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
