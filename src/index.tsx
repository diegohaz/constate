import * as React from "react";

// istanbul ignore next
function warnNoProvider() {
  // eslint-disable-next-line no-console
  console.warn("[constate] Missing Provider");
}

function createContainer<P, S>(
  useValue: (props: P) => S,
  createInputs?: (state: S) => any[]
) {
  const proxy = new Proxy({}, { get: warnNoProvider, apply: warnNoProvider });

  const Context = React.createContext<S>(proxy as S);

  const Provider = (props: { children?: React.ReactNode } & P) => {
    const state = useValue(props);
    // createInputs won't change between renders
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
