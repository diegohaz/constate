import * as React from "react";

declare module "react" {
  // React 16.6

  function memo<Props>(
    component: React.StatelessComponent<Props>
  ): React.StatelessComponent<Props>;

  function lazy<P, Component extends React.ComponentType<P>>(
    importFn: () => Promise<Component | { default: Component }>
  ): Component;

  const Suspense: React.ComponentType<{ fallback?: React.ReactNode }>;

  // React 16.7

  type StateUpdateFunction<State> = (
    newState: State | ((oldState: State) => State)
  ) => void;

  function useState<State>(
    initialState: State | (() => State)
  ): [State, StateUpdateFunction<State>];

  function useEffect(
    f: () => void | Promise<void> | (() => void | Promise<void>),
    keys?: any[]
  ): void;
  function useMutationEffect(
    f: () => void | Promise<void> | (() => void | Promise<void>),
    keys?: any[]
  ): void;
  function useLayoutEffect(
    f: () => void | Promise<void> | (() => void | Promise<void>),
    keys?: any[]
  ): void;

  function useContext<Context>(
    context: React.Context<Context>,
    observedBits?: number
  ): Context;

  type Reducer<State, Action> = (state: State, action: Action) => State;
  function useReducer<State, Action>(
    reducer: Reducer<State, Action>,
    initialState: State,
    initialAction?: Action
  ): [State, (action: Action) => void];

  function useCallback<Callback extends Function, R>(
    f: Callback,
    keys?: any[]
  ): Callback;
  function useMemo<Value>(f: () => Value, keys?: any[]): Value;

  function useRef<T>(): { current: T | null };
  function useRef<T>(initial: T): { current: T };

  function useImperativeMethods<Ref, ImperativeMethods>(
    ref: React.Ref<Ref> | undefined,
    f: () => ImperativeMethods,
    keys?: any[]
  ): void;
}
