import * as React from "react";
import { stringToBinary, parseUpdater, parseInitialState } from "./utils";
import { ContextState } from "./types";

const EmptyContext = React.createContext<ContextState<any>>([{}, () => {}]);

export function createUseContextState<S>(
  Context: React.Context<ContextState<S>>
) {
  return function useContextState<K extends keyof S, SS extends S[K]>(
    contextKey?: K,
    initialState?: SS | (() => SS)
  ): ContextState<SS> {
    const createObservedBits = () =>
      contextKey ? stringToBinary(contextKey) : undefined;

    const observedBits = React.useMemo(createObservedBits, [contextKey]);

    const [contextState, setContextState] = React.useContext(
      contextKey ? Context : EmptyContext,
      observedBits
    );

    let [state, setState] = React.useState(initialState!);

    if (contextKey) {
      state =
        typeof contextState[contextKey] !== "undefined"
          ? contextState[contextKey]
          : parseInitialState(initialState);

      setState = (newState: any) =>
        setContextState((prevState: S) =>
          Object.assign({}, prevState, {
            [contextKey]: parseUpdater(newState, prevState[contextKey])
          })
        );
    }

    React.useMutationEffect(
      () => {
        if (
          contextKey &&
          typeof contextState[contextKey] === "undefined" &&
          typeof initialState !== "undefined"
        ) {
          setState(initialState);
        }
      },
      [contextKey]
    );

    return [state, setState];
  };
}

const useContextState = createUseContextState(EmptyContext);
const [state, setState] = useContextState("lol", { loler: "dadsa" });
const [state1, setState1] = useContextState("lol", () => ({ loler: "dadsa" }));

// export interface ContextState {
//   state: {
//     [key: string]: any;
//   };
//   setState:
//   setContextState?: <S, K>(
//     context: string,
//     updaterOrState: StateUpdater<S> | Partial<S>,
//     callback?: StateCallback,
//     type?: K
//   ) => void;
//   mountContainer?: MountContainer;
// }

// export function createUseContextState<T>(context: Context<T>) {
//   return (contextKey?: string, initialState?: any) => {

//   }
// }

// export function createUseContextEffect(context: Context) {}
