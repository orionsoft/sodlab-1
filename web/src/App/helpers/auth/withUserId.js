import React from 'react'
import autobind from 'autobind-decorator'
import getSession from './getSession'

export default function(ComposedComponent) {
  class WithUserId extends React.Component {
    state = {
      userId: getSession().userId
    }

    componentDidMount() {
      this.interval = setInterval(this.check, 300)
    }

    componentWillUnmount() {
      clearInterval(this.interval)
    }

    @autobind
    check() {
      const {userId} = getSession()
      if (this.state.userId !== userId) {
        this.setState({userId})
      }
    }

    render() {
      return <ComposedComponent {...this.props} userId={this.state.userId} />
    }
  }

  return WithUserId
}
