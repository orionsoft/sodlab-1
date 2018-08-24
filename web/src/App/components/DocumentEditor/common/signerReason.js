import React from 'react'
import PropTypes from 'prop-types'
import Text from 'orionsoft-parts/lib/components/fields/Text'

export default class SignerReason extends React.Component {
  static propTypes = {
    elementId: PropTypes.object,
    collectionId: PropTypes.string,
    styles: PropTypes.object,
    why: PropTypes.string,
    handleWhyChange: PropTypes.func,
    filename: PropTypes.string
  }

  componentDidMount() {
    const { filename } = this.props
    if (!filename) return
    const fileNameLength = filename.split('.').length
    const why = filename
      .split('.')
      .splice(0, fileNameLength - 1)
      .join(' ')
    this.props.handleWhyChange(why)
  }

  render() {
    return (
      // <div className={this.props.styles.inputContainer}>
      //   <label htmlFor="signatureReason">Motivo:</label>
      //   <input
      //     type="text"
      //     id="signatureReason"
      //     name="signatureReason"
      //     onChange={e => this.props.handleWhyChange(e.target.value)}
      //     value={this.props.why}
      //   />
      // </div>
      <div className="autoform-field">
        <div className="label">Nombre</div>
        <Text onChange={this.props.handleWhyChange} value={this.props.why} />
      </div>
    )
  }
}

// return (
//   // <div className={this.props.styles.inputContainer}>
//   //   <label htmlFor="signatureReason">Motivo:</label>
//   //   <input
//   //     type="text"
//   //     id="signatureReason"
//   //     name="signatureReason"
//   //     onChange={e => this.props.handleWhyChange(e.target.value)}
//   //     value={this.props.why}
//   //   />
//   // </div>
//   <div className="autoform-field">
//     <div className="label">Nombre</div>
//     <div>
//       <div className="os-input-container">
//         <input
//           type="text"
//           id="signatureReason"
//           name="signatureReason"
//           onChange={e => this.props.handleWhyChange(e.target.value)}
//           value={this.props.why}
//         />
//       </div>
//     </div>
//   </div>
// )
