import React from 'react'
import PropTypes from 'prop-types'
import numeral from 'numeral'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import rutValidation from '../helpers/rutValidation'

export default class SignerData extends React.Component {
  static propTypes = {
    client: PropTypes.object,
    collectionId: PropTypes.string,
    styles: PropTypes.object,
    handleRutChange: PropTypes.func,
    handleRutValidation: PropTypes.func,
    // valid: PropTypes.bool,
    // checked: PropTypes.bool,
    // rut: PropTypes.string,
    valueKey: PropTypes.string,
    handleClientChange: PropTypes.func
  }

  componentDidUpdate(prevProps) {
    if (this.props.client === prevProps.client) return
  }

  handleRutChange = e => {
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
    this.validate(final)
  }

  handleChange = value => {
    const client = { ...this.props.client, [this.props.valueKey]: value }
    return this.props.handleClientChange(client)
  }

  validate = rut => {
    if (rutValidation(rut)) {
      this.props.handleRutValidation(true, true)
    } else {
      this.props.handleRutValidation(false, true)
    }
  }

  render() {
    console.log(this.props)
    return (
      <div className="autoform-field">
        <div className="label">RUT</div>
        <Select
          value={this.props.client && this.props.client[this.props.valueKey]}
          onChange={this.handleChange}
          options={this.props.selectOptions}
          errorMessage={this.props.errorMessage}
          {...this.props.passProps}
        />
        {/* <label htmlFor="signatureRut">Rut:</label> */}
        {/* <input
          type="text"
          id="signatureRut"
          name="signatureRut"
          onChange={this.handleRutChange}
          value={this.props.rut}
          {...this.props.checked && {
            style: this.props.valid ? null : { border: '1px solid #ff0000' }
          }}
        /> */}
      </div>
    )
  }
}
