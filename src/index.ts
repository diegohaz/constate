import createContext from "./createContext";

const {
  Context,
  Provider,
  useContextRef,
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
  useContextRef,
  useContextReducer,
  useContextState,
  useContextEffect,
  useContextLayoutEffect,
  useContextMutationEffect
};
