import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'

export default class Checkbox extends React.Component {
  static propTypes = {
    fieldOptions: PropTypes.object,
    value: PropTypes.object,
    onChange: PropTypes.func,
    trueLabel: PropTypes.string,
    falseLabel: PropTypes.string
  }

  render() {
    return (
      <div className={styles.container}>
        <label>
          <input
            type="checkbox"
            checked={!!this.props.value}
            onChange={() => this.props.onChange(!this.props.value)}
          />
          <span className={styles.label}>
            {this.props.value ? this.props.trueLabel : this.props.falseLabel}
          </span>
        </label>
      </div>
    )
  }
}
