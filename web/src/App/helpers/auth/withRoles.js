import React from 'react'
import autobind from 'autobind-decorator'
import isArray from 'lodash/isArray'
import getSession from './getSession'
import isEqual from 'lodash/isEqual'

export default function(ComposedComponent) {
  class WithRoles extends React.Component {
    state = {
      roles: getSession().roles
    }

    componentDidMount() {
      this.interval = setInterval(this.check, 300)
    }

    componentWillUnmount() {
      clearInterval(this.interval)
    }

    @autobind
    check() {
      const {roles} = getSession()
      if (!isEqual(this.state.roles, roles)) {
        this.setState({roles})
      }
    }

    render() {
      let {roles} = this.state
      if (!isArray(roles)) roles = []
      return <ComposedComponent {...this.props} roles={roles} />
    }
  }

  return WithRoles
}
