import React from 'react'
import Phone from 'App/components/fields/Phone'

export default class CustomPhoneNumber extends React.Component {
  static propTypes = {
    ...Phone.propTypes
  }

  render() {
    return <Phone {...this.props} />
  }
}
