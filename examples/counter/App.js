import React, { useState } from "react";
import constate from "constate";

// 1️⃣ Create a custom hook as usual
function useCounter() {
  const [count, setCount] = useState(0);
  const increment = () => setCount((prevCount) => prevCount + 1);
  return { count, increment };
}

// 2️⃣ Wrap your hook with the constate factory
const [CounterProvider, useCounterContext] = constate(useCounter);

function Button() {
  // 3️⃣ Use context instead of custom hook
  const { increment } = useCounterContext();
  return <button onClick={increment}>+</button>;
}

function Count() {
  // 4️⃣ Use context in other components
  const { count } = useCounterContext();
  return <span>{count}</span>;
}

function App() {
  // 5️⃣ Wrap your components with Provider
  return (
    <CounterProvider>
      <Count />
      <Button />
    </CounterProvider>
  );
}

export default App;
