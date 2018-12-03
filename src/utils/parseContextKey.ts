import { ContextKey } from "./types";

function parseContextKey<State>(contextKey: ContextKey<keyof State>) {
  if (typeof contextKey === "object" && contextKey) {
    return contextKey.current;
  }
  return contextKey;
}

export default parseContextKey;
