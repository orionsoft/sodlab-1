import React from 'react'
import PropTypes from 'prop-types'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'

@withGraphQL(gql`
  query getDocument($signerId: ID!) {
    getDocument(_id: $signerId) {
      data
    }
  }
`)
export default class SignerData extends React.Component {
  static propTypes = {
    getDocument: PropTypes.object,
    styles: PropTypes.object,
    handleWhoChange: PropTypes.func
  }

  state = {
    checked: null,
    valid: false
  }

  componentDidMount() {
    if (!this.props.getDocument) return
    const {data} = this.props.getDocument
    if (typeof data.nombres === 'undefined' || typeof data.apellidos === 'undefined') return
    const signerName = data.nombre_completo
    this.props.handleWhoChange(signerName)
  }

  validate = () =>
    this.props.who === ''
      ? this.setState({checked: true, valid: false})
      : this.setState({checked: true, valid: true})

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
            style: this.state.valid ? null : {border: '1px solid #ff0000'}
          }}
        />
      </div>
    )
  }
}
