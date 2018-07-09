import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import Select from 'orionsoft-parts/lib/components/fields/Select'

export default class Checkbox extends React.Component {
  static propTypes = {
    value: PropTypes.bool,
    onChange: PropTypes.func,
    trueLabel: PropTypes.string,
    falseLabel: PropTypes.string,
    label: PropTypes.string,
    errorMessage: PropTypes.string
  }

  render() {
    const {onChange, value, trueLabel, falseLabel, label} = this.props
    const options = [
      {value: true, label: trueLabel || label},
      {value: false, label: falseLabel || `No ${label}`}
    ]
    return (
      <div className={styles.container}>
        <Select onChange={onChange} value={value} options={options} />
        <div className="error">{this.props.errorMessage}</div>
      </div>
    )
  }
}
