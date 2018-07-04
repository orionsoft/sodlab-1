import React from 'react'
import DateTime from 'App/components/fields/DateTime'

export default class CustomDateTime extends React.Component {
  static propTypes = {
    ...DateTime.propTypes
  }

  render() {
    return <DateTime {...this.props} format="DD/MM/YYYY HH:mm" enableTime={true} />
  }
}
