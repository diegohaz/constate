import React, { useState } from "react";
import { createContextHook } from "constate";

// 1️⃣ Create a custom hook as usual
function useCounter() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);
  return { count, increment };
}

// 2️⃣ Create container
const useCounterContext = createContextHook(useCounter, value => [value.count]);

function Button() {
  // 3️⃣ Use container context instead of custom hook
  const { increment } = useCounterContext();
  return <button onClick={increment}>+</button>;
}

function Count() {
  // 4️⃣ Use container context in other components
  const { count } = useCounterContext();
  return <span>{count}</span>;
}

function App() {
  // 5️⃣ Wrap your components with container provider
  return (
    <useCounterContext.Provider>
      <Count />
      <Button />
    </useCounterContext.Provider>
  );
}

export default App;
