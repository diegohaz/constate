import * as React from "react";
import { mount, ReactWrapper } from "enzyme";
import { Container, Provider, ContainerProps, ProviderProps } from "../src";

export function wrap(
  props?: Partial<ContainerProps<any>>,
  providerProps?: ProviderProps<any>
) {
  return mount(
    <Provider {...providerProps}>
      <Container {...props}>{state => <div data-state={state} />}</Container>
    </Provider>
  );
}
export function getState(
  wrapper: ReactWrapper,
  selector: keyof JSX.IntrinsicElements = "div"
) {
  return wrapper
    .update()
    .find(selector)
    .prop("data-state") as any;
}
