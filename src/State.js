import React from "react";
import Container from "./Container";

class State extends React.Component {
  constructor(props) {
    super(props);
    console.warn(
      "[constate] `State` is deprecated. Please use `Container` instead. See https://github.com/diegohaz/constate/releases/tag/v0.3.0"
    );
  }

  render() {
    return <Container {...this.props} />;
  }
}

export default State;
