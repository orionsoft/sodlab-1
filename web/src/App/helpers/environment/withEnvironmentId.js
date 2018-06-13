import React from 'react'

export default function(ComposedComponent) {
  class WithEnvironmentId extends React.Component {
    getEnvironmentId() {
      return localStorage.getItem('debugEnvironment')
    }

    render() {
      return <ComposedComponent {...this.props} environmentId={this.getEnvironmentId()} />
    }
  }

  return WithEnvironmentId
}
