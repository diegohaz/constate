const mapWith = (map, transform) =>
  Object.keys(map).reduce(
    (final, key) => ({
      ...final,
      [key]: transform(map[key])
    }),
    {}
  );

export const mapSetStateToActions = (setState, actionsMap) =>
  mapWith(actionsMap, action => (...args) => setState(action(...args)));

export const mapArgumentToFunctions = (argument, fnMap) =>
  mapWith(fnMap, fn => (...args) => fn(...args)(argument));

export const parseUpdater = (updater, state) =>
  typeof updater === "function" ? updater(state) : updater;
