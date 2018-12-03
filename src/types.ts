import * as React from "react";

export type ContextState<S> = [S, React.Dispatch<React.SetStateAction<S>>];

export type ContextReducer<S, A> = [S, React.Dispatch<A>];

export type ContextKeyString<T> = T | undefined | null;

export type ContextKeyObject<T> = React.MutableRefObject<T> | undefined | null;

export type ContextKey<T> = ContextKeyString<T> | ContextKeyObject<T>;

export type HashFunction = (key: string) => number;
