import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import Value from './Value'

export default class View extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    table: PropTypes.object,
    tableField: PropTypes.object,
    options: PropTypes.object
  }

  renderNoValue() {
    return <span className={styles.noValue}>Vacío</span>
  }

  render() {
    if (!this.props.value) return this.renderNoValue()
    return (
      <span className={styles.container}>
        <Value
          options={this.props.options}
          tableId={this.props.table._id}
          fieldName={this.props.tableField.fieldName}
          value={this.props.value}
        />
      </span>
    )
  }
}
