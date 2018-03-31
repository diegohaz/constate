export const mapStateToActions = (setState, actionsMap) =>
  Object.keys(actionsMap).reduce(
    (finalActions, actionKey) => ({
      ...finalActions,
      [actionKey]: (...args) => setState(actionsMap[actionKey](...args)),
    }),
    {},
  )

export const mapStateToSelectors = (state, selectorsMap) =>
  Object.keys(selectorsMap).reduce(
    (finalSelectors, selectorKey) => ({
      ...finalSelectors,
      [selectorKey]: (...args) => selectorsMap[selectorKey](...args)(state),
    }),
    {},
  )
