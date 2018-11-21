import createContext from "./createContext";

const {
  Context,
  Provider,
  useContextReducer,
  useContextState,
  unstable_useContextEffect,
  unstable_useContextLayoutEffect,
  unstable_useContextMutationEffect
} = createContext<{ [key: string]: any }>({});

export {
  createContext,
  Context,
  Provider,
  useContextReducer,
  useContextState,
  unstable_useContextEffect,
  unstable_useContextLayoutEffect,
  unstable_useContextMutationEffect
};
