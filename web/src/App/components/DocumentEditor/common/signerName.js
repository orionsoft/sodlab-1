import React from 'react'
import PropTypes from 'prop-types'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
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
    styles: PropTypes.object,
    who: PropTypes.string,
    handleWhoChange: PropTypes.func,
    firstNameKey: PropTypes.string,
    lastNameKey: PropTypes.string
  }

  state = {
    checked: null,
    valid: false
  }

  componentDidMount() {
    if (!this.props.documentFromCollection) return
    const { documentFromCollection, firstNameKey, lastNameKey } = this.props
    const firstName = documentFromCollection.data[firstNameKey]
    const lastName = documentFromCollection.data[lastNameKey]
    const signerName = `${firstName} ${lastName}`
    this.props.handleWhoChange(signerName)
  }

  validate = () =>
    this.props.who === ''
      ? this.setState({ checked: true, valid: false })
      : this.setState({ checked: true, valid: true })

  render() {
    return (
      <div className={this.props.styles.inputContainer}>
        <label htmlFor="signatureName">Nombre:</label>
        <input
          type="text"
          id="signatureName"
          name="signatureName"
          onChange={e => this.props.handleWhoChange(e.target.value)}
          value={this.props.who}
          onBlur={this.validate}
          {...this.state.checked && {
            style: this.state.valid ? null : { border: '1px solid #ff0000' }
          }}
        />
      </div>
    )
  }
}
