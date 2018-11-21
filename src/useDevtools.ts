import * as React from "react";
import { SetState } from "./types";

export type DevtoolsOptions = {
  name?: string;
  enabled?: boolean;
};

const devtoolsExtension =
  typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION__;

function useDevtools<State>(
  state: State,
  setState: SetState<State>,
  { name, enabled = true }: DevtoolsOptions = {}
) {
  const devtools = React.useRef<ReturnType<
    ReduxDevtoolsExtension["connect"]
  > | null>(null);
  const prevState = React.useRef<State | null>(null);

  React.useEffect(
    () => {
      if (enabled && devtoolsExtension) {
        devtools.current = devtoolsExtension.connect({ name });
        devtools.current.init(state);
        devtools.current.subscribe(message => {
          if (message.type === "DISPATCH" && message.state) {
            setState(JSON.parse(message.state));
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
      if (enabled && devtoolsExtension) {
        let changedKey;
        for (const key in state) {
          if (prevState.current && state[key] !== prevState.current[key]) {
            changedKey = key;
          }
        }
        if (changedKey && devtools.current) {
          devtools.current.send(changedKey, state);
        }
        prevState.current = state;
      }
    },
    [state, enabled]
  );
}

export default useDevtools;
