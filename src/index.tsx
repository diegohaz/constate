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

  if (!splitValues.length) {
    // const [Provider, useCounterContext] = constate(...);
    useContext[0] = Provider;
    useContext[1] = createUseContext(Context);
    return useContext;
  }

  const contexts = [] as Array<React.Context<any>>;

  const SplitProvider: React.FunctionComponent<P> = props => {
    const value = useValue(props);
    return contexts.reduceRight(
      (children, context, i) => (
        // splitValues[i] may be a custom hook, but it won't change between
        // re-renders
        <context.Provider value={splitValues[i](value)}>
          {children}
        </context.Provider>
      ),
      props.children as React.ReactElement
    );
  };

  if (useValue.name) {
    SplitProvider.displayName = `${useValue.name}.Provider`;
  }

  // const [Provider, useCount, useIncrement] = constate(...);
  useContext[0] = SplitProvider;

  splitValues.forEach((_, i) => {
    const context = React.createContext(NO_PROVIDER);
    contexts.push(context);
    useContext[i + 1] = createUseContext(context);
  });

  return useContext;
}

export default constate;
