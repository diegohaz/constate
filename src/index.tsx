import * as React from "react";

// constate(useCounter, value => value.count)
//                      ^^^^^^^^^^^^^^^^^^^^
type Selector<Value> = (value: Value) => any;

// const [Provider, useCount, useIncrement] = constate(...)
//                  ^^^^^^^^^^^^^^^^^^^^^^
type SelectorHooks<Selectors> = {
  [K in keyof Selectors]: () => Selectors[K] extends (...args: any) => infer R
    ? R
    : never;
};

// const [Provider, useCounterContext] = constate(...)
// or               ^^^^^^^^^^^^^^^^^
// const [Provider, useCount, useIncrement] = constate(...)
//                  ^^^^^^^^^^^^^^^^^^^^^^
type Hooks<
  Value,
  Selectors extends Selector<Value>[]
> = Selectors["length"] extends 0 ? [() => Value] : SelectorHooks<Selectors>;

// const [Provider, useContextValue] = constate(useValue)
//       ^^^^^^^^^^^^^^^^^^^^^^^^^^^
type ConstateTuple<Props, Value, Selectors extends Selector<Value>[]> = [
  React.FC<Props>,
  ...Hooks<Value, Selectors>
];

const isDev = process.env.NODE_ENV !== "production";

const NO_PROVIDER = {};

function createUseContext(context: React.Context<any>): any {
  return () => {
    const value = React.useContext(context);
    if (isDev && value === NO_PROVIDER) {
      // eslint-disable-next-line no-console
      console.warn("Component must be wrapped with Provider.");
    }
    return value;
  };
}

function constate<Props, Value, Selectors extends Selector<Value>[]>(
  useValue: (props: Props) => Value,
  ...selectorsArg: Selectors
): ConstateTuple<Props, Value, Selectors> {
  const selectors: Selector<Value>[] = selectorsArg.length
    ? selectorsArg
    : [(value: Value) => value];

  const contexts = selectors.map(() => React.createContext(NO_PROVIDER));

  const hooks = contexts.map(createUseContext) as Hooks<Value, Selectors>;

  const Provider: React.FC<Props> = ({ children, ...props }) => {
    const value = useValue(props as Props);
    return contexts.reduce(
      (accElement, Context, i) => (
        <Context.Provider value={selectors[i](value)}>
          {accElement}
        </Context.Provider>
      ),
      children as React.ReactElement
    );
  };

  if (isDev && useValue.name) {
    Provider.displayName = `${useValue.name}.Provider`;
  }

  return [Provider, ...hooks];
}

export default constate;
