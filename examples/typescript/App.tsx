// It just works! No need to type anything explicitly.
import * as React from "react";
import createContextHook from "constate";

function useCounter({ initialCount = 0 } = {}) {
  const [count, setCount] = React.useState(initialCount);
  const increment = () => setCount(count + 1);
  return { count, increment };
}

const useCounterContext = createContextHook(useCounter, value => [value.count]);

function IncrementButton() {
  const { increment } = useCounterContext();
  return <button onClick={increment}>+</button>;
}

function Count() {
  const { count } = useCounterContext();
  return <span>{count}</span>;
}

function App() {
  return (
    <useCounterContext.Provider initialCount={10}>
      <Count />
      <IncrementButton />
    </useCounterContext.Provider>
  );
}

export default App;
