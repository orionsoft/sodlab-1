import React from 'react'
import PropTypes from 'prop-types'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import gql from 'graphql-tag'

@withGraphQL(gql`
  query documentFromCollection($collectionId: ID!, $elementId: JSON) {
    documentFromCollection(collectionId: $collectionId, elementId: $elementId)
  }
`)
export default class SignerData extends React.Component {
  static propTypes = {
    elementId: PropTypes.object,
    collectionId: PropTypes.string,
    documentFromCollection: PropTypes.object,
    handleWhoChange: PropTypes.func,
    firstNameKey: PropTypes.string,
    lastNameKey: PropTypes.string
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.elementId.rut === nextProps.elementId.rut) return false
    return true
  }

  render() {
    if (!this.props.documentFromCollection) return
    const { documentFromCollection, firstNameKey, lastNameKey } = this.props
    const firstName = documentFromCollection.data[firstNameKey]
    const lastName = documentFromCollection.data[lastNameKey]
    const signerName = `${firstName} ${lastName}`
    this.props.handleWhoChange(signerName)

    return (
      <div className="autoform-field">
        <div className="label">Nombre</div>
        <Text onChange={value => this.props.handleWhoChange(value)} value={signerName} />
      </div>
    )
  }
}
