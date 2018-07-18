import React from 'react'
import PropTypes from 'prop-types'
import withSubscription from 'react-apollo-decorators/lib/withSubscription'
import gql from 'graphql-tag'
import autobind from 'autobind-decorator'
import {withApollo} from 'react-apollo'

@withApollo
@withSubscription(
  gql`
    subscription collectionDataChanged($environmentId: ID, $collectionId: ID) {
      collectionDataChanged(environmentId: $environmentId, collectionId: $collectionId)
    }
  `,
  'onUpdate'
)
export default class Watch extends React.Component {
  static propTypes = {
    client: PropTypes.object,
    environmentId: PropTypes.string,
    collectionId: PropTypes.string
  }

  @autobind
  onUpdate(data) {
    this.props.client.queryManager.refetchQueryByName(`paginated_${this.props.collectionId}`)
  }

  render() {
    return <span />
  }
}
