import * as React from "react";
import {
  ContextState,
  SetState,
  ContextKey,
  ContextKeyString,
  HashFunction
} from "./types";

export function parseContextKey<State>(contextKey: ContextKey<keyof State>) {
  if (typeof contextKey === "object" && contextKey) {
    return contextKey.current;
  }
  return contextKey;
}

const EmptyContext = React.createContext<any>([]);

export function useHashContext<State>(
  key: ContextKeyString<keyof State>,
  context: React.Context<ContextState<State>>,
  hash: HashFunction
): ContextState<State> {
  // @ts-ignore
  return React.useContext(
    key ? context : EmptyContext,
    key ? hash(key as string) : undefined
  );
}

export function useInitialState<State>(
  key: ContextKeyString<keyof State>,
  state: State[keyof State] | undefined | null,
  contextState: State,
  setContextState: SetState<State>
) {
  React.useLayoutEffect(
    () => {
      if (key && contextState[key] == null && state != null) {
        setContextState(prevState => {
          if (prevState[key] == null) {
            return { ...prevState, [key]: state };
          }
          return prevState;
        });
      }
    },
    [key]
  );
}

// istanbul ignore next
const devtoolsExtension =
  typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION__;

// istanbul ignore next
export function useDevtools<State>(
  state: State,
  setState: SetState<State>,
  { enabled }: { enabled?: boolean } = {}
) {
  const devtools = React.useRef<ReturnType<
    ReduxDevtoolsExtension["connect"]
  > | null>(null);
  const prevState = React.useRef<State | null>(null);
  const lastStateSentFromDevtools = React.useRef<State | null>(null);

  React.useEffect(
    () => {
      // istanbul ignore next
      if (enabled && devtoolsExtension) {
        devtools.current = devtoolsExtension.connect();
        devtools.current.init(state);
        devtools.current.subscribe(message => {
          if (message.type === "DISPATCH" && message.state) {
            lastStateSentFromDevtools.current = JSON.parse(message.state);
            setState(lastStateSentFromDevtools.current!);
          }
        });
        return () => {
          if (devtools.current) {
            devtools.current.unsubscribe();
            devtoolsExtension.disconnect();
          }
        };
      }
      return undefined;
    },
    [enabled]
  );

  React.useEffect(
    () => {
      // istanbul ignore next
      if (enabled && devtoolsExtension) {
        if (lastStateSentFromDevtools.current !== state) {
          let changedKey;
          for (const key in state) {
            if (prevState.current && state[key] !== prevState.current[key]) {
              changedKey = key;
            }
          }
          if (changedKey && devtools.current) {
            devtools.current.send(changedKey, state);
          }
        }
        prevState.current = state;
      }
    },
    [state, enabled]
  );
}
