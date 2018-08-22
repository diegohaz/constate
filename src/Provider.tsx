/* eslint-disable react/sort-comp, react/no-unused-state, no-underscore-dangle */
import * as React from "react";
import Context from "./Context";
import { parseUpdater } from "./utils";
import {
  StateUpdater,
  StateCallback,
  MountContainer,
  SetContextState
} from "./types";

const reduxDevtoolsExtension =
  typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION__;

interface OnMountProps<S> {
  state: S;
  setContextState: SetContextState<S, string>;
}

interface OnUpdateProps<S> {
  prevState: S;
  state: S;
  setContextState: SetContextState<S, string>;
  context: string;
  type?: string;
}

interface OnUnmountProps<S> {
  state: S;
}

interface ProviderProps<S> {
  initialState: Partial<S>;
  devtools?: boolean;
  onMount?: (props: OnMountProps<S>) => void;
  onUpdate?: (props: OnUpdateProps<S>) => void;
  onUnmount?: (props: OnUnmountProps<S>) => void;
}

interface ProviderState<S> {
  state: S;
  setContextState: SetContextState<S, string>;
  mountContainer: MountContainer;
}

class Provider<State extends { [key: string]: any }> extends React.Component<
  ProviderProps<State>,
  ProviderState<State>
> {
  static defaultProps = {
    initialState: {}
  };

  private containers: { [key: string]: number } = {};

  private devtools?: ReturnType<ReduxDevtoolsExtension["connect"]>;

  constructor(props: ProviderProps<State>) {
    super(props);
    const { devtools, initialState } = props;

    this.state = {
      state: initialState as State,
      mountContainer: this.mountContainer,
      setContextState: this.setContextState
    };

    // istanbul ignore next
    if (devtools && reduxDevtoolsExtension) {
      this.devtools = reduxDevtoolsExtension.connect({ name: "Context" });
      this.devtools.init(initialState);
      this.devtools.subscribe(message => {
        if (message.type === "DISPATCH" && message.state) {
          this.setState(state => ({
            state: Object.assign({}, state.state, JSON.parse(message.state))
          }));
        }
      });
    }
  }

  componentDidMount() {
    if (this.props.onMount) {
      this.props.onMount(this.getProps("Provider/onMount"));
    }
  }

  componentWillUnmount() {
    if (this.props.onUnmount) {
      const { setContextState, ...args } = this.getProps();
      this.props.onUnmount(args);
    }
    // istanbul ignore next
    if (this.devtools && reduxDevtoolsExtension) {
      this.devtools.unsubscribe();
      reduxDevtoolsExtension.disconnect();
    }
  }

  mountContainer: MountContainer = (context, onMount) => {
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

  setContextState: SetContextState<State, string> = (
    context,
    updater,
    callback,
    type
  ) => {
    let prevState: State;

    const updaterFn: StateUpdater<ProviderState<State>> = state => {
      prevState = state.state;
      return {
        state: Object.assign({}, state.state, {
          [context]: Object.assign(
            {},
            state.state[context],
            parseUpdater(updater, state.state[context] || {})
          )
        })
      };
    };

    const callbackFn = () => {
      if (this.props.onUpdate) {
        const onUpdateProps = {
          ...this.getProps("Provider/onUpdate"),
          prevState,
          context,
          type
        };
        this.props.onUpdate(onUpdateProps);
      }
      if (callback) callback();
      // istanbul ignore next
      if (this.devtools && type) {
        const devtoolsType = context ? `${context}/${type}` : type;
        this.devtools.send(devtoolsType, this.state.state);
      }
    };

    // @ts-ignore
    this.setState(updaterFn, callbackFn);
  };

  getProps = (type?: string) => {
    const { state, setContextState } = this.state;
    return {
      state,
      setContextState: (
        context: string,
        updater: StateUpdater<State> | Partial<State>,
        callback?: StateCallback
      ) => setContextState(context, updater, callback, type)
    };
  };

  render() {
    return (
      // @ts-ignore
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export default Provider;
