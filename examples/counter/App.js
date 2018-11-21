import React from "react";
import { Provider, useContextState } from "constate";

function useCounter(context) {
  const [count, setCount] = useContextState(context, 0);
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  return { count, increment, decrement };
}

function IncrementButton() {
  const { increment } = useCounter("counter1");
  return <button onClick={increment}>+</button>;
}

function DecrementButton() {
  const { decrement } = useCounter("counter1");
  return <button onClick={decrement}>-</button>;
}

function Count() {
  const { count } = useCounter("counter1");
  return <span>{count}</span>;
}

function App() {
  return (
    <Provider>
      <DecrementButton />
      <Count />
      <IncrementButton />
    </Provider>
  );
}

export default App;
