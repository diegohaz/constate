import * as React from "react";

export type StateUpdater<State> = (state: State) => State;

export type SetState<State> = (state: State | StateUpdater<State>) => void;

export type Reducer<State, Action> = (state: State, action: Action) => State;

export type ContextState<State> = [State, SetState<State>];

export type ContextReducer<State, Action> = [State, (action: Action) => void];

export type ContextKeyString<T> = T | undefined | null;

export type ContextKeyObject<T> = React.MutableRefObject<T> | undefined | null;

export type ContextKey<T> = ContextKeyString<T> | ContextKeyObject<T>;

export type HashFunction = (key: string) => number;
