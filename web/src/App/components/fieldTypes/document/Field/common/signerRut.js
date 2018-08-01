import React from 'react'
import PropTypes from 'prop-types'
import numeral from 'numeral'
import rutValidation from '../../RUT/rutValidation'
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
    handleRutChange: PropTypes.func,
    valid: PropTypes.object,
    checked: PropTypes.object
  }

  componentDidMount() {
    if (!this.props.getDocument) return 
    const { data } = this.props.getDocument
    if (typeof data.rut === 'undefined') return
    this.props.handleRutChange(data.rut)
  }

  handleRutChange = (e) => {
    let value = e.target.value
    if (value.length < 3) {
      this.props.handleRutChange(value)
      return
    }
    let numbers = value.replace(/[^\dkK]/g, '')
    let parts = numbers.split('')
    if (parts.length === 0) return numbers
    let last = parts.pop()
    if (parts.length === 0) return numbers
    let final = numeral(parts.join('')).format('0,0') + '-' + last
    final = final.replace(/,/g, '.')
    this.props.handleRutChange(final)
  }

  validate = () => {
    let valor = this.props.rut
    if (rutValidation(valor)) {
      this.props.handleRutValidation(true, true)
    } else {
      this.props.handleRutValidation(false, true)
    }
  }

  render() {
    return (
      <div className={this.props.styles.inputContainer}>
        <label htmlFor="signatureRut">Rut:</label>
        <input 
          type="text"
          id="signatureRut"
          name="signatureRut"
          onChange={this.handleRutChange}
          value={this.props.rut}
          onBlur={this.validate}
          {...this.props.checked && {
            style: this.props.valid ? null : {border: '1px solid #ff0000'}
          }}
        />
      </div>
    )
  }
}