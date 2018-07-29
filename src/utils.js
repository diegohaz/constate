// @flow
/* eslint-disable arrow-body-style */

/*::
import type { Action, Selector, Effect, HandleSetState } from "./types";
type ExtractReturnType = <V>(() => V) => V
type Func<T, K, R> = (T, K) => R
type Obj<K, T> = {[K]: T}
*/

const mapWith = /*:: <T, R: mixed, K: string>*/ (
  map /*: Obj<K, T>*/,
  transform /*: Func<T, K, R>*/
) /*: Obj<K, R>*/ =>
  Object.keys(map).reduce(
    (final, key) => ({
      ...final,
      [key]: transform(map[key], key)
    }),
    {}
  );

export const mapSetStateToActions = /*:: <K: string, O: {[K]: Action}>*/ (
  setState /*: HandleSetState */,
  actionsMap /*: O*/
) /*: $ObjMap<O, ExtractReturnType>*/ => {
  return mapWith(actionsMap, (action, key) => (...args) =>
    setState(action(...args), undefined, key)
  );
};

export const mapArgumentToFunctions = /*:: <M: Action | Selector | Effect, T, K: string, O: {[K]: M}>*/ (
  argument /*: T | (fn: mixed, key: K) => T */,
  fnMap /*: O*/
) /*: $ObjMap<O, ExtractReturnType>*/ => {
  // $FlowFixMe
  return mapWith(fnMap, (fn, key) => (...args) => {
    if (typeof argument === "function") {
      // $FlowFixMe
      return fn(...args)(argument(fn, key));
    }
    // $FlowFixMe
    return fn(...args)(argument);
  });
};

export const parseUpdater = /*:: <T>*/ (
  updater /*: T|(T)=>T*/,
  state /*: T*/
) => (typeof updater === "function" ? updater(state) : updater);
