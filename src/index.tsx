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

type ContextHook<P, V> = {
  (): V;
  Context: React.Context<V>;
  Provider: React.FunctionComponent<P>;
};

function createContextHook<P, V, SV extends Array<(value: V) => any>>(
  useValue: (props: P) => V,
  ...splitValues: SV
): SV["length"] extends 0
  ? ContextHook<P, V> & [React.FunctionComponent<P>, ContextHook<P, V>]
  : ContextHook<P, V> &
      [React.FunctionComponent<P>] & {
        1: SV[0] extends (value: V) => infer U ? ContextHook<P, U> : never;
        2: SV[1] extends (value: V) => infer U ? ContextHook<P, U> : never;
        3: SV[2] extends (value: V) => infer U ? ContextHook<P, U> : never;
        4: SV[3] extends (value: V) => infer U ? ContextHook<P, U> : never;
        5: SV[4] extends (value: V) => infer U ? ContextHook<P, U> : never;
        6: SV[5] extends (value: V) => infer U ? ContextHook<P, U> : never;
        7: SV[6] extends (value: V) => infer U ? ContextHook<P, U> : never;
        8: SV[7] extends (value: V) => infer U ? ContextHook<P, U> : never;
        9: SV[8] extends (value: V) => infer U ? ContextHook<P, U> : never;
      } {
  const Context = React.createContext(defaultValue as V);

  const Provider: React.FunctionComponent<P> = props => {
    const value = useValue(props);
    // createMemoDeps won't change between renders
    // DEPRECATE THIS IN FAVOR OF MEMOIZING INSIDE USEVALUE
    // MAYBE PROVIDE A HELPER?
    // createContextHook(withMemo(useCounter, value => [value.count]))
    // Maybe not?
    const memoizedValue = splitValues[0]
      ? React.useMemo(() => value, splitValues[0](value))
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

  const contexts = [] as Array<React.Context<any>>;

  if (!splitValues.length) {
    // @ts-ignore
    useContext[0] = Provider;
    // @ts-ignore
    useContext[1] = useContext;
    return useContext as any;
  }

  function MultipleProvider(props: { children?: React.ReactNode } & P) {
    const value = useValue(props);
    return contexts.reduceRight(
      (children, ctx, i) => (
        <ctx.Provider value={splitValues[i](value)}>{children}</ctx.Provider>
      ),
      props.children
    );
  }

  splitValues.forEach((_, i) => {
    const Ctx = React.createContext(defaultValue as any);
    const useCtx = () => React.useContext(Ctx);
    contexts.push(Ctx);
    useCtx.Context = Ctx;
    useCtx.Provider = MultipleProvider;
    // @ts-ignore;
    useContext[i + 1] = useCtx;
  });

  // @ts-ignore
  useContext[0] = MultipleProvider;
  return useContext as any;
}

export default createContextHook;
