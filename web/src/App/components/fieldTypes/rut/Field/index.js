import React from 'react'
import Rut from 'App/components/fields/Rut'

export default class CustomRUT extends React.Component {
  static propTypes = {
    ...Rut.propTypes
  }

  render() {
    return <Rut {...this.props} />
  }
}
