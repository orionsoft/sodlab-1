import React from 'react'
import PropTypes from 'prop-types'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'

@withGraphQL(gql`
  query documentFromCollection($collectionId: ID!, $elementId: JSON) {
    documentFromCollection(collectionId: $collectionId, elementId: $elementId)
  }
`)
export default class SignerReason extends React.Component {
  static propTypes = {
    elementId: PropTypes.object,
    collectionId: PropTypes.string,
    documentFromCollection: PropTypes.object,
    styles: PropTypes.object,
    why: PropTypes.string,
    handleWhyChange: PropTypes.func,
    uploadedFileName: PropTypes.string
  }

  componentDidMount() {
    const { uploadedFileName } = this.props
    if (!uploadedFileName) return
    const fileNameLength = uploadedFileName.split('.').length
    const fileName = this.props.uploadedFileName
      .split('.')
      .splice(0, fileNameLength - 1)
      .join(' ')
    this.props.handleWhyChange(fileName)
  }

  render() {
    return (
      <div className={this.props.styles.inputContainer}>
        <label htmlFor="signatureReason">Motivo:</label>
        <input
          type="text"
          id="signatureReason"
          name="signatureReason"
          onChange={e => this.props.handleWhyChange(e.target.value)}
          value={this.props.why}
        />
      </div>
    )
  }
}
