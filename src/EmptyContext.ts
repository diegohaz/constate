import { createContext } from "react";
import { ContextState } from "./types";

const initialState: ContextState<any> = [{}, () => {}];

export default createContext(initialState);
