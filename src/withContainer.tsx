import * as React from "react";
import Container from "./Container";
import { WithContainerProps } from "./types";

const withContainer = <S, AP, SP, EP>(
  containerProps: WithContainerProps<S, AP, SP, EP>
) => (WrappedComponent: React.ComponentType<S & AP & SP & EP>) => (
  props: any
) => (
  <Container {...containerProps}>
    {(state: any) => <WrappedComponent {...props} {...state} />}
  </Container>
);

export default withContainer;
