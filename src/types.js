// @flow
/* eslint-disable */

import type { Node, ComponentType, Element } from "react";

type HashMap = {
  [string]: mixed
};

export type Action = <T>(
  ...args: Array<mixed>
) => (state: $ReadOnly<T>) => $ReadOnly<T>;

export type Selector = <T>(
  ...args: Array<mixed>
) => (state: $ReadOnly<T>) => mixed;

export type Effect = <T>(
  ...args: Array<mixed>
) => ({
  state: $ReadOnly<T>,
  setState?: (state: $ReadOnly<T>) => $ReadOnly<T>
}) => void;

export type RenderProp = <T>(T) => Node;

export type HandleSetState = <T>(
  updater: (state: $ReadOnly<T>) => T,
  callback?: () => void,
  type?: string
) => void;

export type ContainerState = HashMap | void;

export type Callbacks = {
  onMount?: mixed => void,
  onUnmount?: mixed => void,
  onUpdate?: mixed => void
};

export type ContainerProps = {
  children: RenderProp,
  context?: string,

  initialState?: ContainerState,
  actions?: { [string]: Action },
  selectors?: { [string]: Selector },
  effects?: { [string]: Effect },

  shouldUpdate?: mixed => boolean
} & Callbacks;

type GetArgsType =
  | "onMount"
  | "onUpdate"
  | "onUnmount"
  | "Provider/onMount"
  | "Provider/onUpdate";

export type GetArgs = (
  additionalArgs?: mixed,
  type?: GetArgsType
) => { state: HashMap, setContextState?: SetContextState };

export type MountContainer = (
  context: string,
  onMount: (mixed) => void
) => (onUnmount: (mixed) => void) => void;

export type SetContextState = (
  context: string,
  updater: () => void,
  callback?: () => void,
  type?: GetArgsType
) => void;

export type ContextContainerProps = {
  mountContainer: (context: string, other: mixed) => void, // MountContainer
  context: string,
  state: HashMap,
  setContextState: (context: string, ...args: Array<mixed>) => void // SetContextState
} & ContainerProps;

export type ProviderState = {
  state: HashMap,
  mountContainer: MountContainer,
  setContextState: SetContextState
};

export type ProviderProps = {
  initialState: HashMap,
  children: RenderProp,
  devtools?: boolean
} & Callbacks;

export type ContainerType = ComponentType<ContainerProps>;

export type ContainerFunction = (
  props: ContainerProps
) => Element<ContainerType>;
