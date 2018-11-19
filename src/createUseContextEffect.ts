import * as React from "react";
import { ContextState } from "./types";
import createUseContextState from "./createUseContextState";

function createUseContextEffect<State>(
  context: React.Context<ContextState<State>>,
  type: "useEffect" | "useMutationEffect" | "useLayoutEffect" = "useEffect"
) {
  const useContextState = createUseContextState(context);

  return (
    contextKey: keyof State | undefined | null,
    create: () => void | (() => void),
    inputs?: ReadonlyArray<any>
  ) => {
    const consumer = React.useRef(null);
    const [consumers, setConsumers] = useContextState(
      // @ts-ignore
      contextKey ? `__${contextKey}_consumers` : null,
      []
    ) as ContextState<Array<React.RefObject<any>>>;

    const isNewConsumer = consumers.indexOf(consumer) === -1;
    const nextConsumers = isNewConsumer ? [consumer, ...consumers] : consumers;

    React.useMutationEffect(
      () => {
        if (!contextKey) return undefined;

        if (isNewConsumer) {
          setConsumers(nextConsumers);
        }

        return () => {
          setConsumers(prevConsumers => {
            const index = prevConsumers.indexOf(consumer);
            return [
              ...prevConsumers.slice(0, index),
              ...prevConsumers.slice(index + 1)
            ];
          });
        };
      },
      [contextKey]
    );

    React[type](
      () => {
        if (!contextKey || nextConsumers.indexOf(consumer) === 0) {
          return create();
        }
        return undefined;
      },
      inputs ? [contextKey, ...inputs] : undefined
    );
  };
}

export default createUseContextEffect;
