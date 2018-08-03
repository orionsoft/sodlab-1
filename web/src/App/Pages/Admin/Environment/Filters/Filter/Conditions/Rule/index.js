import React from 'react'
import styles from './styles.css'
import {Field} from 'simple-react-form'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import PropTypes from 'prop-types'
import includes from 'lodash/includes'
import fieldTypes from 'App/components/fieldTypes'
import Checkbox from 'App/components/fieldTypes/checkbox/Field'
import FieldTypeOptions from 'App/components/FieldTypeOptions'

export default class Item extends React.Component {
  static propTypes = {
    collection: PropTypes.object,
    operators: PropTypes.array,
    rule: PropTypes.object
  }

  getTypes() {
    return [
      {value: 'fixed', label: 'Valor fijo'},
      {value: 'editable', label: 'Editable'},
      {value: 'parameter', label: 'Parametro'}
    ]
  }

  getFields() {
    const fields = [{value: '_id', label: 'ID'}]
    for (const field of this.props.collection.fields) {
      fields.push({value: field.name, label: field.label})
    }
    return fields
  }

  getOperators() {
    const {rule, collection, operators} = this.props
    const list = operators
      .filter(operator => {
        if (!rule.fieldName) return false
        const collectionField = collection.fields.find(field => field.name === rule.fieldName)
        if (!collectionField) return false
        return includes(collectionField.fieldType.allowedOperatorsIds, operator._id)
      })
      .map(operator => {
        return {value: operator._id, label: operator.name}
      })

    if (list.length === 0) {
      return [{value: 'idEquals', label: 'Es igual'}]
    }

    return list
  }

  renderOperationFieldOptions() {
    const {rule, operators} = this.props
    if (rule.type === 'parameter') return
    if (!rule.operatorId) return null
    const operator = operators.find(operator => operator._id === rule.operatorId)
    if (!operator) return null
    if (!operator.fieldType.optionsParams) return null
    return (
      <FieldTypeOptions
        label="Opciones del operador"
        fieldName="operatorInputOptions"
        fieldType={operator.fieldType}
      />
    )
  }

  renderEditableLabel() {
    const {rule} = this.props
    if (rule.type !== 'editable') return

    return (
      <div className={styles.fixedValue}>
        <div className="row">
          <div className="col-xs-12 col-sm-6">
            <div className="description">Título</div>
            <Field fieldName="editableLabel" type={Text} />
          </div>
          <div className="col-xs-12 col-sm-6">
            <div className="description">Variable</div>
            <Field fieldName="parameterName" type={Text} />
          </div>
        </div>
      </div>
    )
  }

  renderFixedValue() {
    const {rule, operators} = this.props
    if (rule.type !== 'fixed') return
    if (!rule.fieldName) return null
    if (!rule.operatorId) return null
    const operator = operators.find(operator => operator._id === rule.operatorId)
    if (!operator) return null
    if (!rule.isValid) return null
    const FieldComponent = fieldTypes[operator.inputType].field
    return (
      <div className={styles.fixedValue}>
        <div className="description">Valor</div>
        <Field fieldName="fixed.value" type={FieldComponent} {...rule.operatorInputOptions} />
      </div>
    )
  }

  renderParameterOptions() {
    const {rule} = this.props
    if (rule.type !== 'parameter') return
    return (
      <div className={styles.fixedValue}>
        <div className="description">Variable</div>
        <Field fieldName="parameterName" type={Text} />
      </div>
    )
  }

  renderOptional() {
    const {rule} = this.props
    return (
      <div>
        <div className="label">Opcional</div>
        <Field
          fieldName="optional"
          type={Checkbox}
          label="Opcional"
          disabled={rule.type === 'fixed'}
        />
      </div>
    )
  }

  render() {
    return (
      <div className={styles.container}>
        <div className="label">Tipo</div>
        <Field fieldName="type" type={Select} options={this.getTypes()} />
        {this.renderOptional()}
        <br />
        <div className="row">
          <div className="col-xs-12 col-sm-6">
            <div className="label">Campo</div>
            <Field fieldName="fieldName" type={Select} options={this.getFields()} />
          </div>
          <div className="col-xs-12 col-sm-6">
            <div className="label">Operación</div>
            <Field fieldName="operatorId" type={Select} options={this.getOperators()} />
          </div>
        </div>
        {this.renderEditableLabel()}
        {this.renderOperationFieldOptions()}
        {this.renderFixedValue()}
        {this.renderParameterOptions()}
      </div>
    )
  }
}
