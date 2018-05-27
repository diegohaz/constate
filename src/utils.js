const mapWith = (map, transform) =>
  Object.keys(map).reduce(
    (final, key) => ({
      ...final,
      [key]: transform(map[key], key)
    }),
    {}
  );

export const mapSetStateToActions = (setState, actionsMap) =>
  mapWith(actionsMap, (action, key) => (...args) =>
    setState(action(...args), undefined, key)
  );

export const mapArgumentToFunctions = (argument, fnMap) =>
  mapWith(fnMap, (fn, key) => (...args) => {
    if (typeof argument === "function") {
      return fn(...args)(argument(fn, key));
    }
    return fn(...args)(argument);
  });

export const parseUpdater = (updater, state) =>
  typeof updater === "function" ? updater(state) : updater;
