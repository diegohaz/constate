import React, { useState, useContext } from "react";
import createContainer from "constate";

// 1️⃣ Create a custom hook as usual
function useCounter() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);
  return { count, increment };
}

// 2️⃣ Create container
const MainCounter = createContainer(useCounter, value => [value.count]);

function Button() {
  // 3️⃣ Use container context instead of custom hook
  const { increment } = useContext(MainCounter.Context);
  return <button onClick={increment}>+</button>;
}

function Count() {
  // 4️⃣ Use container context in other components
  const { count } = useContext(MainCounter.Context);
  return <span>{count}</span>;
}

function App() {
  // 5️⃣ Wrap your components with container provider
  return (
    <MainCounter.Provider>
      <Count />
      <Button />
    </MainCounter.Provider>
  );
}

export default App;
