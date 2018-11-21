import { StateUpdater } from "./types";

const hashMap: { [key: string]: number } = {};

export function hash(string: string) {
  if (hashMap[string] !== undefined) {
    return hashMap[string];
  }
  const { length } = Object.keys(hashMap);
  hashMap[string] = 1 << length;
  return hashMap[string];
}

export function parseUpdater<S>(state: StateUpdater<S> | S, prevState: S) {
  const isUpdater = (a: any): a is StateUpdater<S> => typeof a === "function";
  return isUpdater(state) ? state(prevState) : state;
}
