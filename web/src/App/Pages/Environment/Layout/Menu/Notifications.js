import React from 'react'
import PropTypes from 'prop-types'
import withSubscription from 'react-apollo-decorators/lib/withSubscription'
import gql from 'graphql-tag'
import autobind from 'autobind-decorator'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'

@withMessage
@withSubscription(
  gql`
    subscription notificationInserted {
      notificationInserted {
        _id
        title
        content
        path
      }
    }
  `,
  'onNotif'
)
export default class Watch extends React.Component {
  static propTypes = {
    environmentId: PropTypes.string,
    notificationInserted: PropTypes.object,
    showMessage: PropTypes.object
  }

  @autobind
  onNotif() {
    console.log('oasdasdsa')
    const {environmentUpdated} = this.props
    console.log({environmentUpdated})
    this.props.showMessage('asdad')
  }

  render() {
    console.log('asd')
    console.log(this.props)
    return <span />
  }
}
