import createContext from "./createContext";

const {
  Context,
  Provider,
  useContextReducer,
  useContextState,
  useContextKey,
  useContextEffect,
  useContextLayoutEffect
} = createContext<{ [key: string]: any }>({});

export {
  createContext,
  Context,
  Provider,
  useContextReducer,
  useContextState,
  useContextKey,
  useContextEffect,
  useContextLayoutEffect
};
