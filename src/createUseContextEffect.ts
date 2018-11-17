import * as React from "react";
import { ContextState } from "./types";
import createUseContextState from "./createUseContextState";

function createUseContextEffect<State>(
  Context: React.Context<ContextState<State>>,
  type: "useEffect" | "useMutationEffect" | "useLayoutEffect" = "useEffect"
) {
  const useContextState = createUseContextState(Context);

  return (
    contextKey: keyof State | undefined | null,
    create: () => void | (() => void),
    inputs?: ReadonlyArray<any>
  ) => {
    const ref = React.useRef(null);
    const [refs, setRefs] = useContextState(
      // @ts-ignore
      `__${contextKey}_refs`,
      []
    ) as ContextState<Array<React.RefObject<any>>>;

    React.useMutationEffect(() => {
      if (refs.indexOf(ref) === -1) {
        setRefs([...refs, ref]);
      }
      return () => {
        setRefs(prevRefs => {
          const index = prevRefs.indexOf(ref);
          return [...prevRefs.slice(0, index), ...prevRefs.slice(index + 1)];
        });
      };
    }, []);

    React[type](() => {
      if (refs.indexOf(ref) === 0) {
        return create();
      }
      return undefined;
    }, inputs);
  };
}

export default createUseContextEffect;
