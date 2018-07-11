import React from 'react'
import Currency from 'App/components/fields/Currency'

export default class CustomCurrency extends React.Component {
  static propTypes = {
    ...Currency.propTypes
  }

  render() {
    return <Currency {...this.props} />
  }
}
