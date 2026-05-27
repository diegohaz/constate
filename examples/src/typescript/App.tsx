// It just works! No need to type anything explicitly.

import constate from "constate";
import { useCallback, useState } from "react";

function useCounter({ initialCount = 0 } = {}) {
  const [count, setCount] = useState(initialCount);
  const increment = useCallback(() => setCount((c) => c + 1), []);
  return { count, increment };
}

const [CounterProvider, useCount, useIncrement] = constate(
  useCounter,
  (value) => value.count,
  (value) => value.increment,
);

function IncrementButton() {
  const increment = useIncrement();
  return <button onClick={increment}>+</button>;
}

function Count() {
  const count = useCount();
  return <span>{count}</span>;
}

function App() {
  return (
    <CounterProvider initialCount={10}>
      <Count />
      <IncrementButton />
    </CounterProvider>
  );
}

export default App;
