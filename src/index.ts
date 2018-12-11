import createContext from "./createContext";
import createContainer from "./createContainer";

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
  createContainer,
  createContext,
  Context,
  Provider,
  useContextReducer,
  useContextState,
  useContextKey,
  useContextEffect,
  useContextLayoutEffect
};
