import * as React from "react";

function throwNoProvider() {
  if (process.env.NODE_ENV === "development") {
    throw new Error("[constate] Missing Provider");
  }
}

function createContainer<P, T>(
  useValue: (props: P) => T,
  createInputs?: (state: T) => any[]
) {
  const proxy = new Proxy({}, { get: throwNoProvider, apply: throwNoProvider });

  const Context = React.createContext<T>(proxy as T);

  const Provider = (props: { children?: React.ReactNode } & P) => {
    const state = useValue(props);
    const value = createInputs
      ? React.useMemo(() => state, createInputs(state))
      : state;
    return <Context.Provider value={value}>{props.children}</Context.Provider>;
  };

  return {
    Context,
    Provider
  };
}

export default createContainer;
