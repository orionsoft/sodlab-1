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
    styles: PropTypes.object,
    handleWhoChange: PropTypes.func,
    firstNameKey: PropTypes.string,
    lastNameKey: PropTypes.string
  }

  shouldComponentUpdate(nextProps) {
    console.log('nextProps', nextProps)
    console.log('this.props', this.props)
    if (this.props.elementId.rut === nextProps.elementId.rut) return false
    return true
  }

  renderInput = () => {
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

  render() {
    return this.renderInput()
    // return (
    //   <div className="autoform-field">
    //     {/* <label htmlFor="signatureName">Nombre:</label> */}
    //     {this.renderInput()}
    //   </div>
    // )
  }
}

// return (
//   <div className="autoform-field">
//     <div className="label">Nombre</div>
//     <div>
//       <div className="os-input-container">
//         {/* <Text
//       className="os-input-text"
//       fieldName="signatureName"
//       onChange={value => this.props.handleWhoChange(value)}
//       value={signerName}
//       onBlur={this.validate}
//       {...this.state.checked && {
//         style: this.state.valid ? null : { border: '1px solid #ff0000' }
//       }}
//     /> */}
//         <input
//           className="os-input-text"
//           type="text"
//           id="signatureName"
//           name="signatureName"
//           value={signerName}
//           onBlur={this.validate}
//           {...this.state.checked && {
//             style: this.state.valid ? null : { border: '1px solid #ff0000' }
//           }}
//         />
//       </div>
//     </div>
//   </div>
// )
