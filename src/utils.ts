import {
  ActionMap,
  SelectorMap,
  EffectMap,
  StateUpdater,
  EffectProps,
  SetStateWithType
} from "./types";

const keys = Object.keys as <T>(o: T) => (keyof T)[];

export function mapSetStateToActions<S, P>(
  setState: SetStateWithType<S, keyof P>,
  actionMap: ActionMap<S, P>
) {
  return keys(actionMap).reduce(
    (map, type) =>
      Object.assign(map, {
        [type]: (...args: any[]) =>
          setState(actionMap[type](...args), undefined, type)
      }),
    {} as P
  );
}

export function mapStateToSelectors<S, P>(
  state: S,
  selectorMap: SelectorMap<S, P>
) {
  return keys(selectorMap).reduce(
    (map, type) =>
      Object.assign(map, {
        [type]: (...args: any[]) => selectorMap[type](...args)(state)
      }),
    {} as P
  );
}

export function mapPropsToEffects<S, P>(
  getEffectProps: (type: keyof P) => EffectProps<S>,
  effectMap: EffectMap<S, P>
) {
  return keys(effectMap).reduce(
    (final, type) =>
      Object.assign(final, {
        [type]: (...args: any[]) =>
          effectMap[type](...args)(getEffectProps(type))
      }),
    {} as P
  );
}

export function parseUpdater<S>(
  updaterOrState: StateUpdater<S> | Partial<S>,
  state: S
) {
  return typeof updaterOrState === "function"
    ? updaterOrState(state)
    : updaterOrState;
}
