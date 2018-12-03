import * as React from "react";
import { ContextKeyString, ContextState, HashFunction } from "./types";

const EmptyContext = React.createContext<any>([]);

function useHashContext<State>(
  key: ContextKeyString<keyof State>,
  context: React.Context<ContextState<State>>,
  hash: HashFunction
): ContextState<State> {
  // @ts-ignore
  return React.useContext(
    key ? context : EmptyContext,
    key ? hash(key as string) : undefined
  );
}

export default useHashContext;
