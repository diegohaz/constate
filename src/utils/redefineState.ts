import { ContextKeyString, ContextState, ContextReducer } from "./types";

function redefineState<State, Action>(
  key: ContextKeyString<keyof State>,
  [contextState, setContextState]: ContextState<State>,
  [state, dispatch]: ContextReducer<State[keyof State], Action>,
  reducer: React.Reducer<typeof state, any>
): ContextReducer<typeof state, Action> {
  if (key) {
    return [
      contextState[key] != null ? contextState[key] : state,
      (nextState: any) =>
        setContextState(prevState => ({
          ...prevState,
          [key]: reducer(prevState[key], nextState)
        }))
    ];
  }
  return [state, dispatch];
}

export default redefineState;
