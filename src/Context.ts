import { createContext } from "react";
import { ContextState } from "./types";

const initialState: ContextState<{ [key: string]: any }> = [{}, () => {}];

export const EmptyContext = createContext(initialState as ContextState<any>);

export default createContext(initialState);
