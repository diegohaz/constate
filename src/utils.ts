import { StateUpdater } from "./types";

export function stringToBinary(string: string) {
  const { length } = string;
  let output = "";
  for (let i = 0; i < length; i += 1) {
    output += string[i].charCodeAt(0).toString(2);
  }
  return +output;
}

export function parseUpdater<S>(state: StateUpdater<S> | S, prevState: S) {
  const isUpdater = (a: any): a is StateUpdater<S> => typeof a === "function";
  return isUpdater(state) ? state(prevState) : state;
}

export function parseInitialState<S>(initialState?: S | (() => S)) {
  const isFunction = (a: any): a is (() => S) => typeof a === "function";
  return isFunction(initialState) ? initialState() : initialState;
}
