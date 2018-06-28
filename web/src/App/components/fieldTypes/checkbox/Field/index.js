import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'

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
    return (
      <div className={styles.container}>
        <label>
          <input type="checkbox" checked={!!value} onChange={() => onChange(!this.props.value)} />
          <span className={styles.label}>{(value ? trueLabel : falseLabel) || label}</span>
        </label>
        <div className="error">{this.props.errorMessage}</div>
      </div>
    )
  }
}
