import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import Field from './Field'

export default class FieldOptions extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    field: PropTypes.object,
    errorMessage: PropTypes.node,
    collectionId: PropTypes.string,
    includeId: PropTypes.bool,
    passProps: PropTypes.object,
    parentCollection: PropTypes.string,
    parentField: PropTypes.string
  }

  renderSelectCollection() {
    return (
      <div>
        <div className={styles.selectCollection}>Selecciona una colección</div>
        <div className="error">{this.props.errorMessage}</div>
      </div>
    )
  }

  renderSelectField() {
    return (
      <div>
        <div className={styles.selectCollection}>Selecciona un campo</div>
        <div className="error">{this.props.errorMessage}</div>
      </div>
    )
  }

  renderField(collectionId, field) {
    return <Field {...this.props} collectionId={collectionId} field={field} />
  }

  render() {
    if (this.props.parentCollection && this.props.parentField) {
      if (!this.props.field) return this.renderSelectCollection()
      if (!this.props.field.options) return this.renderSelectCollection()
      if (!this.props.field.options[this.props.parentCollection]) {
        return this.renderSelectCollection()
      }
      if (!this.props.field.options[this.props.parentField]) {
        return this.renderSelectField()
      }
      return this.renderField(
        this.props.field.options[this.props.parentCollection],
        this.props.field.options[this.props.parentField]
      )
    }
  }
}
