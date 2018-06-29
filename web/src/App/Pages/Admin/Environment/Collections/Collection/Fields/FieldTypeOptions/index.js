import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import ObjectField from 'App/components/fields/ObjectField'
import Fields from 'App/components/AutoForm/Fields'
import schemaToField from 'App/components/schemaToField'
import {Field} from 'simple-react-form'

export default class FieldTypeOptions extends React.Component {
  static propTypes = {
    fieldType: PropTypes.object,
    fieldName: PropTypes.string,
    label: PropTypes.node
  }

  static defaultProps = {
    fieldName: 'options',
    label: 'Opciones'
  }

  render() {
    if (!this.props.fieldType.optionsParams) return null
    return (
      <div className={styles.container}>
        <div className="description">{this.props.label}</div>
        <Field fieldName={this.props.fieldName} type={ObjectField}>
          <Fields schemaToField={schemaToField} params={this.props.fieldType.optionsParams} />
        </Field>
      </div>
    )
  }
}
