import * as React from "react";
import { SplitValueFunction, ContextHookReturn } from "./types";

const isDev = process.env.NODE_ENV !== "production";

const NO_PROVIDER = "_NP_" as any;

function createUseContext(context: React.Context<any>): any {
  return () => {
    const value = React.useContext(context);
    if (isDev && value === NO_PROVIDER) {
      // eslint-disable-next-line no-console
      console.warn("[constate] Component not wrapped within a Provider.");
    }
    return value;
  };
}

function warnAboutObjectUsage() {
  if (isDev) {
    // eslint-disable-next-line no-console
    console.warn(
      "[constate] Getting { Context, Provider } from constate is deprecated. " +
        "Please, use the tuple format instead. " +
        "See instructions on https://github.com/diegohaz/constate/pull/101"
    );
  }
}

function constate<P, V, S extends Array<SplitValueFunction<V>>>(
  useValue: (props: P) => V,
  ...splitValues: S
): ContextHookReturn<P, V, S> {
  const Context = React.createContext(NO_PROVIDER as V);

  const Provider: React.FunctionComponent<P> = props => {
    const value = useValue(props);
    return <Context.Provider value={value}>{props.children}</Context.Provider>;
  };

  if (isDev && useValue.name) {
    Context.displayName = `${useValue.name}.Context`;
    Provider.displayName = `${useValue.name}.Provider`;
  }

  // const useCounterContext = constate(...)
  const useContext: any = () => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.warn(
        "[constate] Using the return value of constate as a hook is deprecated. " +
          "Please, use the tuple format instead. " +
          "See instructions on https://github.com/diegohaz/constate/pull/101"
      );
    }
    return createUseContext(Context)();
  };

  // const { Context, Provider } = constate(...)
  Object.defineProperties(useContext, {
    Context: {
      get() {
        warnAboutObjectUsage();
        return Context;
      }
    },
    Provider: {
      get() {
        warnAboutObjectUsage();
        return Provider;
      }
    }
  });

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

    if (isDev && useValue.name) {
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
