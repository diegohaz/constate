import * as React from "react";

// istanbul ignore next
function warnNoProvider() {
  // eslint-disable-next-line no-console
  console.warn("[constate] Missing Provider");
}

function createContainer<P, V>(
  useValue: (props: P) => V,
  createMemoInputs?: (value: V) => any[]
) {
  const proxy = new Proxy({}, { get: warnNoProvider, apply: warnNoProvider });

  const Context = React.createContext<V>(proxy as V);

  const Provider = (props: { children?: React.ReactNode } & P) => {
    const state = useValue(props);
    // createMemoInputs won't change between renders
    const value = createMemoInputs
      ? React.useMemo(() => state, createMemoInputs(state))
      : state;
    return <Context.Provider value={value}>{props.children}</Context.Provider>;
  };

  return {
    Context,
    Provider
  };
}

export default createContainer;
