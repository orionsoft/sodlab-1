import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import {Field, WithValue} from 'simple-react-form'
import getField from 'App/helpers/fields/getField'
import ObjectField from 'App/components/fields/ObjectField'
import schemaToField from 'App/components/schemaToField'
import autobind from 'autobind-decorator'

export default class Option extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    schema: PropTypes.object,
    optionsPreview: PropTypes.object
  }

  getTypes() {
    return [{value: 'fixed', label: 'Valor fijo'}, {value: 'parameter', label: 'Parámetro'}]
  }

  renderParameterOptions() {
    return (
      <div>
        <div className="label">Nombre de la variable</div>
        <Field fieldName="parameterName" type={getField('string')} />
      </div>
    )
  }

  renderFixedValue() {
    console.log(this.props.optionsPreview)
    return (
      <div className={styles.fixedValue}>
        <div className="label">Valor</div>
        <Field
          fieldName="fixed.value"
          type={schemaToField(this.props.schema.type, this.props.schema)}
          field={{options: this.props.optionsPreview}}
          {...this.props.schema.fieldOptions}
          parentCollection={this.props.schema.parentCollection || null}
        />
      </div>
    )
  }

  @autobind
  renderTypeOption(option) {
    if (!option) return
    if (option.type === 'fixed') {
      return this.renderFixedValue()
    } else if (option.type === 'parameter') {
      return this.renderParameterOptions()
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <Field fieldName={this.props.name} type={ObjectField}>
          <div className={styles.label}>{this.props.schema.label}</div>
          <div className="row">
            <div className="col-xs-12 col-sm-6">
              <div className="label">Tipo</div>
              <Field fieldName="type" type={getField('select')} options={this.getTypes()} />
            </div>
            <div className="col-xs-12 col-sm-6">
              <WithValue>{this.renderTypeOption}</WithValue>
            </div>
          </div>
        </Field>
      </div>
    )
  }
}
