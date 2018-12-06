import * as React from "react";
import { Provider, createContext, useContextState } from "constate";

// The default context shape is { [key: string]: any }
// So here we just accept a string as the key
function useCounter(key?: string) {
  // `count` type is inferred by the initial state (number)
  const [count, setCount] = useContextState(key, 0);
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  return { count, increment, decrement };
}

function IncrementButton() {
  const { increment } = useCounter("counter1");
  return <button onClick={increment}>+</button>;
}

function Count() {
  const { count } = useCounter("counter1");
  return <span>{count}</span>;
}

// You can define a different shape when creating new contexts
const Custom = createContext<{
  foo?: string;
  counter1: number;
  counter2: number;
}>({
  counter1: 0,
  counter2: 0
});

// When using custom contexts, you'll have to define the key based on the
// context shape
// If we put "foo" here, it'll show errors, since this custom hook is
// expecting context slices with number values
function useCustomCounter(key?: "counter1" | "counter2") {
  // `count` type is inferred by the context shape (number)
  const [count, setCount] = Custom.useContextState(key);
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  return { count, increment, decrement };
}

function CustomIncrementButton() {
  const { increment } = useCustomCounter("counter1");
  return <button onClick={increment}>+</button>;
}

function CustomCount() {
  const { count } = useCustomCounter("counter1");
  return <span>{count}</span>;
}

function App() {
  return (
    <div>
      <Provider devtools>
        <Count />
        <IncrementButton />
      </Provider>
      <Custom.Provider>
        <CustomCount />
        <CustomIncrementButton />
      </Custom.Provider>
    </div>
  );
}

export default App;
