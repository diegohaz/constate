export type ObjectOf<T> = { [key: string]: T };

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type StateUpdater<S> = (state: S) => S;

export type SetState<S> = (state: S | StateUpdater<S>) => void;

export type ContextState<S> = [S, SetState<S>];

export type ProviderProps = {
  children: React.ReactNode;
};
