import React from 'react'
import PropTypes from 'prop-types'
import Field from './Field'
import styles from './styles.css'

export default class FieldSelect extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    field: PropTypes.object,
    errorMessage: PropTypes.node,
    collectionId: PropTypes.string,
    includeId: PropTypes.bool
  }

  static defaultProps = {
    includeId: true
  }

  renderSelectCollection() {
    return (
      <div>
        <div className={styles.selectCollection}>Selecciona una coleción</div>
        <div className="error">{this.props.errorMessage}</div>
      </div>
    )
  }

  renderField(collectionId) {
    return <Field {...this.props} includeId={this.props.includeId} collectionId={collectionId} />
  }

  render() {
    if (this.props.collectionId) {
      return this.renderField(this.props.collectionId)
    } else {
      if (!this.props.field) return this.renderSelectCollection()
      if (!this.props.field.options) return this.renderSelectCollection()
      if (!this.props.field.options.collectionId) return this.renderSelectCollection()
      return this.renderField(this.props.field.options.collectionId)
    }
  }
}
