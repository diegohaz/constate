import * as React from "react";

// istanbul ignore next
function warnNoProvider() {
  // eslint-disable-next-line no-console
  console.warn("[constate] Missing Provider");
}

// istanbul ignore next
const canUseProxy =
  process.env.NODE_ENV === "development" && typeof Proxy !== "undefined";

// istanbul ignore next
const defaultValue = canUseProxy
  ? new Proxy({}, { get: warnNoProvider, apply: warnNoProvider })
  : {};

export function createContextHook<P, V>(
  useValue: (props: P) => V,
  createMemoDeps?: (value: V) => any[]
) {
  const Context = React.createContext(defaultValue as V);

  const Provider: React.FunctionComponent<P> = props => {
    const value = useValue(props);
    // createMemoDeps won't change between renders
    const memoizedValue = createMemoDeps
      ? React.useMemo(() => value, createMemoDeps(value))
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

  const useContext = () => React.useContext(Context);
  useContext.Context = Context;
  useContext.Provider = Provider;
  return useContext;
}

export default /* istanbul ignore next */ function<P, V>(
  useValue: (props: P) => V,
  createMemoDeps?: (value: V) => any[]
) {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.warn(
      '[constate] Importing default from "constate" is deprecated. Please `import { createContextHook } from "constate"` instead'
    );
  }
  return createContextHook(useValue, createMemoDeps);
}
