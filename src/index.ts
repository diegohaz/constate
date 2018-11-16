import createContext from "./createContext";
import createUseContextReducer from "./createUseContextReducer";
import createUseContextState from "./createUseContextState";

const {
  Context,
  Provider,
  useContextReducer,
  useContextState
} = createContext<{ [key: string]: any }>({});

export {
  createContext,
  createUseContextReducer,
  createUseContextState,
  Context,
  Provider,
  useContextReducer,
  useContextState
};

// const lol1 = createContext({ counter1: 0 });

// const [count1, setCount1] = lol1.useContextState("counter1");
// const [count11, dispatch1] = lol1.useContextReducer(
//   "counter1",
//   (state, action: { type: string }) => state
// );
// const [count111, dispatch11] = lol1.useContextReducer(
//   "counter1",
//   (state, action: { type: string }) => state,
//   0,
//   { type: "LOL" }
// );

// const lol2 = createContext<{ [key: string]: any }>({});

// const [count2, setCount2] = lol2.useContextState("counter1", 0);
// const [count22, dispatch2] = lol2.useContextReducer(
//   "counter1",
//   (state, action: { type: string }) => state,
//   0
// );
// const [count222, dispatch22] = lol2.useContextReducer(
//   "counter1",
//   (state, action: { type: string }) => state,
//   0,
//   { type: "LOL" }
// );

// const lol3 = createContext({ counter1: 0 });

// const [count3, setCount3] = lol3.useContextState("counter1", 0);
