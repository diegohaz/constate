/* eslint-disable no-param-reassign, no-use-before-define, no-unused-expressions */
import React from "react";
import {
  mapSetStateToActions,
  mapArgumentToFunctions,
  parseUpdater
} from "./utils";

const getProps = (Container, props) => {
  const getNextProps = rendered => {
    const nextProps = { ...rendered.props, ...props };
    return getProps(rendered.type, nextProps);
  };

  if (React.isValidElement(Container)) {
    return getNextProps(Container);
  }

  const container = new Container({ children: () => null });
  const rendered = container.render ? container.render() : container;

  if (!React.isValidElement(rendered)) {
    return props;
  }

  return getNextProps(rendered);
};

const mapToDraft = (object, draft) =>
  Object.keys(object).forEach(key => {
    draft[key] = object[key];
  });

const mount = Container => {
  const {
    initialState,
    actions,
    selectors,
    effects,
    onMount,
    onUpdate
  } = getProps(Container);

  const state = { ...initialState };

  const setState = (updater, callback, type) => {
    const prevState = { ...state };
    mapToDraft(parseUpdater(updater, state), state);
    if (onUpdate) {
      onUpdate(getArgs({ prevState, type }, "onUpdate"));
    }
    if (callback) callback();
  };

  const getArgs = (additionalArgs, setStateType) => ({
    state,
    setState: (u, c) => setState(u, c, setStateType),
    ...additionalArgs
  });

  typeof onMount === "function" && onMount(getArgs({}, "onMount"));

  actions && mapToDraft(mapSetStateToActions(setState, actions), state);
  selectors && mapToDraft(mapArgumentToFunctions(state, selectors), state);
  effects && mapToDraft(mapArgumentToFunctions(getArgs, effects), state);

  return state;
};

export default mount;
