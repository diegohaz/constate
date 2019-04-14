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

function createUseContext<P, V>(
  useValue: (props: P) => V,
  createMemoInputs?: (value: V) => any[]
) {
  const Context = React.createContext(defaultValue as V);

  const Provider = (props: { children?: React.ReactNode } & P) => {
    const value = useValue(props);
    // createMemoInputs won't change between renders
    const memoizedValue = createMemoInputs
      ? React.useMemo(() => value, createMemoInputs(value))
      : value;
    return (
      <Context.Provider value={memoizedValue}>
        {props.children}
      </Context.Provider>
    );
  };

  const useContextValue = () => React.useContext(Context);
  useContextValue.Context = Context;
  useContextValue.Provider = Provider;
  return useContextValue;
}

export default createUseContext;
