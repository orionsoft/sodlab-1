import React from 'react'
import Percentage from 'App/components/fields/Percentage'

export default class CustomPercentage extends React.Component {
  static propTypes = {
    ...Percentage.propTypes
  }

  render() {
    return <Percentage {...this.props} />
  }
}
