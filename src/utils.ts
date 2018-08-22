import {
  ActionMap,
  SelectorMap,
  EffectMap,
  StateUpdater,
  ValueOf,
  EffectProps,
  Dictionary,
  SetStateWithType
} from "./types";

type APIMap<S, P> = ActionMap<S, P> | SelectorMap<S, P> | EffectMap<S, P>;

const mapWith = <
  C extends (...args: any[]) => any,
  M extends APIMap<any, any>,
  F extends ValueOf<M>
>(
  map: M,
  transform: (fn: F, key: keyof M) => C
): Dictionary<C> =>
  Object.keys(map).reduce(
    (final, key) => ({
      ...final,
      [key]: transform(map[key] as F, key)
    }),
    {}
  );

export const mapSetStateToActions = <S, P>(
  setState: SetStateWithType<S, keyof P>,
  actionMap: ActionMap<S, P>
) =>
  mapWith(actionMap, (action, type) => (...args) =>
    setState(action(...args), undefined, type)
  );

export const mapStateToSelectors = <S, P>(
  state: S,
  selectorMap: SelectorMap<S, P>
) => mapWith(selectorMap, selector => (...args) => selector(...args)(state));

export const mapPropsToEffects = <S, P>(
  getEffectProps: (type: keyof P) => EffectProps<S>,
  effectMap: EffectMap<S, P>
) =>
  mapWith(effectMap, (effect, type) => (...args) =>
    effect(...args)(getEffectProps(type))
  );

// _ is a temporary fix for eslint parser
export const parseUpdater = <S, _ = never>(
  updaterOrState: StateUpdater<S> | Partial<S>,
  state: S
) =>
  typeof updaterOrState === "function" ? updaterOrState(state) : updaterOrState;
