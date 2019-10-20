import * as React from "react";
import { SplitValueFunction, ContextHookReturn } from "./types";

const NO_PROVIDER = "CONSTATE_NO_PROVIDER" as any;

function createUseContext(context: React.Context<any>): any {
  return () => {
    const value = React.useContext(context);
    if (process.env.NODE_ENV !== "production" && value === NO_PROVIDER) {
      // eslint-disable-next-line no-console
      console.warn("[constate] Component not wrapped within a Provider.");
    }
    return value;
  };
}

function constate<P, V, S extends Array<SplitValueFunction<V>>>(
  useValue: (props: P) => V,
  ...splitValues: S
): ContextHookReturn<P, V, S> {
  const Context = React.createContext(NO_PROVIDER as V);

  const Provider: React.FunctionComponent<P> = props => {
    const value = useValue(props);
    const [createMemoDeps] = splitValues;
    const deps = createMemoDeps && createMemoDeps(value);

    if (process.env.NODE_ENV !== "production" && Array.isArray(deps)) {
      // eslint-disable-next-line no-console
      console.warn(
        "[constate] Passing `createMemoDeps` as the second argument is deprecated.",
        "Please, use `React.useMemo` in your custom hook instead.",
        "See https://github.com/diegohaz/constate/issues/98"
      );
    }

    // deps won't change between renders
    const memoizedValue = Array.isArray(deps)
      ? React.useMemo(() => value, deps)
      : value;

    return (
      <Context.Provider value={memoizedValue}>
        {props.children}
      </Context.Provider>
    );
  };

  if (useValue.name) {
    Context.displayName = `${useValue.name}.Context`;
    Provider.displayName = `${useValue.name}.Provider`;
  }

  // const useCounterContext = constate(...)
  const useContext = createUseContext(Context);

  // const { Context, Provider } = constate(...)
  useContext.Context = Context;
  useContext.Provider = Provider;

  const tuple = [] as any[];

  if (!splitValues.length) {
    // const [Provider, useCounterContext] = constate(...);
    tuple.push(Provider, createUseContext(Context));
  } else {
    const contexts = [] as Array<React.Context<any>>;

    const SplitProvider: React.FunctionComponent<P> = props => {
      const value = useValue(props);
      let children = props.children as React.ReactElement;

      for (let i = 0; i < contexts.length; i += 1) {
        const context = contexts[i];
        // splitValue may be a hook, but it won't change between re-renders
        const splitValue = splitValues[i];
        children = (
          <context.Provider value={splitValue(value)}>
            {children}
          </context.Provider>
        );
      }

      return children;
    };

    if (useValue.name) {
      SplitProvider.displayName = `${useValue.name}.Provider`;
    }

    // const [Provider, useCount, useIncrement] = constate(...);
    tuple.push(SplitProvider);

    for (let i = 0; i < splitValues.length; i += 1) {
      const context = React.createContext(NO_PROVIDER);
      contexts.push(context);
      tuple.push(createUseContext(context));
    }
  }

  for (let i = 0; i < tuple.length; i += 1) {
    useContext[i] = tuple[i];
  }

  if (typeof Symbol === "function" && Symbol.iterator) {
    useContext[Symbol.iterator] = /* istanbul ignore next */ () =>
      tuple[Symbol.iterator]();
  }

  return useContext;
}

export default constate;
