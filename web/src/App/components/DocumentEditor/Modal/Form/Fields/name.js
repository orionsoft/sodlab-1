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

  componentDidMount() {
    if (!this.props.documentFromCollection) return
    this.handleNameChange()
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.documentFromCollection._id === nextProps.documentFromCollection._id) return false
    return true
  }

  componentDidUpdate(prevProps) {
    this.handleNameChange()
  }

  handleNameChange = () => {
    const signerName = this.getSignerName()
    return this.props.handleWhoChange(signerName)
  }

  getSignerName = () => {
    const {documentFromCollection, firstNameKey, lastNameKey} = this.props
    const firstName = documentFromCollection.data[firstNameKey]
    const lastName = documentFromCollection.data[lastNameKey]
    return `${firstName} ${lastName}`
  }

  render() {
    if (!this.props.documentFromCollection) return
    const signerName = this.getSignerName()

    return (
      <div className="autoform-field">
        <div className="label">Nombre</div>
        <Text onChange={this.props.handleWhoChange} value={signerName} />
      </div>
    )
  }
}
