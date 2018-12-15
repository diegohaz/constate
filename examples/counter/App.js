import React, { useState, useContext } from "react";
import createContainer from "constate";

// 1️⃣ Create a custom hook as usual
function useCounter() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);
  return { count, increment };
}

// 2️⃣ Create container
const CounterContainer = createContainer(useCounter, value => [value.count]);

function Button() {
  // 3️⃣ Use container context instead of custom hook
  const { increment } = useContext(CounterContainer.Context);
  return <button onClick={increment}>+</button>;
}

function Count() {
  // 4️⃣ Use container context in other components
  const { count } = useContext(CounterContainer.Context);
  return <span>{count}</span>;
}

function App() {
  // 5️⃣ Wrap your components with container provider
  return (
    <CounterContainer.Provider>
      <Count />
      <Button />
    </CounterContainer.Provider>
  );
}

export default App;
