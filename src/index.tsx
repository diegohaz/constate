import * as React from "react";

// istanbul ignore next
function warnNoProvider() {
  // eslint-disable-next-line no-console
  console.warn("[constate] Missing Provider");
}

function failNoProvider() {
  throw new Error(
    "[constate] useContainer may not be used without a Provider, except in test or development environments"
  );
}

const canOmitProvider = () =>
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";

// istanbul ignore next
const canUseProxy =
  process.env.NODE_ENV === "development" && typeof Proxy !== "undefined";

// istanbul ignore next
const defaultValue = canUseProxy
  ? new Proxy({}, { get: warnNoProvider, apply: warnNoProvider })
  : undefined;

function createContainer<P, V>(
  useValue: (props: P) => V,
  createMemoInputs?: (value: V) => any[]
) {
  const Context = React.createContext<V>(defaultValue as V);

  const Provider = (props: { children?: React.ReactNode } & P) => {
    const value = useValue(props);
    if (typeof value === "undefined") {
      throw new Error("[constate] value hook may not return undefined");
    }

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

  const useContainer = (props: P) => {
    let value = React.useContext(Context);
    if (value === defaultValue) {
      if (!canOmitProvider()) failNoProvider();
      value = useValue(props);
    }
    return value;
  };

  return {
    Context,
    Provider,
    useContainer
  };
}

export default createContainer;
