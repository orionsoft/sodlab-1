import React from 'react'
import PropTypes from 'prop-types'
import Field from './Field'
import styles from './styles.css'

export default class FieldSelect extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    field: PropTypes.object,
    errorMessage: PropTypes.node
  }

  renderSelectCollection() {
    return (
      <div>
        <div className={styles.selectCollection}>Selecciona una coleción</div>
        <div className="error">{this.props.errorMessage}</div>
      </div>
    )
  }

  render() {
    if (!this.props.field) return this.renderSelectCollection()
    if (!this.props.field.options) return this.renderSelectCollection()
    if (!this.props.field.options.collectionId) return this.renderSelectCollection()
    return <Field {...this.props} collectionId={this.props.field.options.collectionId} />
  }
}
