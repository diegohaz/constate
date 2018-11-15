export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type StateUpdater<S> = (state: S) => S;

export type SetState<S> = (state: StateUpdater<S> | S) => void;

export type ContextState<S> = [S, SetState<S>];
