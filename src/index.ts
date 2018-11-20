import createContext from "./createContext";

const {
  Context,
  Provider,
  useContextReducer,
  useContextState,
  useContextEffect,
  useContextLayoutEffect,
  useContextMutationEffect
} = createContext<{ [key: string]: any }>({});

export {
  createContext,
  Context,
  Provider,
  useContextReducer,
  useContextState,
  useContextEffect,
  useContextLayoutEffect,
  useContextMutationEffect
};
