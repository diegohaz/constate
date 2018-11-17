import createContext from "./createContext";
import createUseContextEffect from "./createUseContextEffect";
import createUseContextReducer from "./createUseContextReducer";
import createUseContextState from "./createUseContextState";

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
  createUseContextEffect,
  createUseContextReducer,
  createUseContextState,
  Context,
  Provider,
  useContextReducer,
  useContextState,
  useContextEffect,
  useContextLayoutEffect,
  useContextMutationEffect
};
