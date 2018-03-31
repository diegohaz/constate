import React from 'react'
import PropTypes from 'prop-types'
import Context from './Context'

class Provider extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    initialState: PropTypes.object,
  }

  static defaultProps = {
    initialState: {},
  }

  state = this.props.initialState

  onSetState = (...args) => this.setState(...args)

  render() {
    return (
      <Context.Provider
        value={{
          state: this.state,
          setState: this.onSetState,
        }}
      >
        {this.props.children}
      </Context.Provider>
    )
  }
}

export default Provider
