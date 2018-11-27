import React from "react";
import { Provider, useContextState } from "constate";

// 1. Create a custom hook
function useCounter(key) {
  // 2. Replace React.useState(0) by useContextState(key, 0)
  const [count, setCount] = useContextState(key, 0);
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  return { count, increment, decrement };
}

function IncrementButton() {
  // 3. Consume the custom hook as usual
  const { increment } = useCounter("counter1");
  return <button onClick={increment}>+</button>;
}

function DecrementButton() {
  // 4. Consume the same key in other components
  const { decrement } = useCounter("counter1");
  return <button onClick={decrement}>-</button>;
}

function Count() {
  // 5. Consume the same key in other components
  const { count } = useCounter("counter1");
  return <span>{count}</span>;
}

function App() {
  // 6. Wrap your app with Provider
  return (
    <Provider devtools>
      <DecrementButton />
      <Count />
      <IncrementButton />
    </Provider>
  );
}

export default App;
