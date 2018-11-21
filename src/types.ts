export type StateUpdater<State> = (state: State) => State;

export type SetState<State> = (state: State | StateUpdater<State>) => void;

export type Reducer<State, Action> = (state: State, action: Action) => State;

export type ContextState<State> = [State, SetState<State>];

export type ContextReducer<State, Action> = [State, (action: Action) => void];
