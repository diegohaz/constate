import createContext from "./createContext";

const lol1 = createContext({ counter1: 0 });

const [count1, setCount1] = lol1.useContextState("counter1");

const lol2 = createContext<{ [key: string]: any }>({});

const [count2, setCount2] = lol2.useContextState("counter1", 0);

const lol3 = createContext({ counter1: 0 });

const [count3, setCount3] = lol3.useContextState("counter1", 0);
