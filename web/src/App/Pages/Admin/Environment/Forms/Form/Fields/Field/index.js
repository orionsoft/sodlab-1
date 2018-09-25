import React from 'react'
import styles from './styles.css'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import Checkbox from 'App/components/fieldTypes/checkbox/Field'
import {Field} from 'simple-react-form'
import PropTypes from 'prop-types'
import CollectionFieldSelect from 'App/components/fieldTypes/collectionFieldSelect/Field'
import fieldTypes from 'App/components/fieldTypes'
import range from 'lodash/range'

export default class FormField extends React.Component {
  static propTypes = {
    field: PropTypes.object,
    form: PropTypes.object,
    collection: PropTypes.object,
    indicators: PropTypes.object
  }

  getTypes() {
    return [
      {value: 'fixed', label: 'Valor fijo'},
      {value: 'editable', label: 'Editable'},
      {value: 'parameter', label: 'Parametro'},
      {value: 'indicator', label: 'Indicador'}
    ]
  }

  renderEditableLabel() {
    if (this.props.field.type !== 'editable') return
    return (
      <div>
        <div className="label">Título</div>
        <Field fieldName="editableLabel" type={Text} />
      </div>
    )
  }

  renderIndicatorId() {
    if (this.props.field.type !== 'indicator') return
    return (
      <div>
        <div className="label">Indicador</div>
        <Field fieldName="indicatorId" type={Select} options={this.props.indicators.items} />
      </div>
    )
  }

  renderFixedValue() {
    const {field, collection} = this.props
    if (field.type !== 'fixed') return
    if (!field.fieldName) return
    if (!collection) return
    const collectionField = collection.fields.find(cf => cf.name === field.fieldName)
    if (!collectionField) return
    const FieldComponent = fieldTypes[collectionField.type].field
    return (
      <div className={styles.fixedValue}>
        <div className="label">Valor</div>
        <Field
          collectionFieldName={
            (collectionField.type === 'manyOf' || collectionField.type === 'oneOf') &&
            collectionField.name
          }
          fieldName="fixed.value"
          type={FieldComponent}
          {...collectionField.options}
        />
      </div>
    )
  }

  renderParameterOptions() {
    if (this.props.field.type !== 'parameter') return
    return (
      <div>
        <div className="label">Variable</div>
        <Field fieldName="parameterName" type={Text} />
      </div>
    )
  }

  renderOptional() {
    const {field, form} = this.props
    if (!field.fieldName || !form.collection.fields) return
    const element = form.collection.fields.find(formField => {
      return formField.name === field.fieldName
    })
    return (
      <div>
        <div className="label">Opcional</div>
        <Field
          fieldName="optional"
          type={Checkbox}
          label="Opcional"
          disabled={(element && !element.optional) || field.type === 'fixed'}
        />
      </div>
    )
  }

  renderDefault() {
    if (this.props.field.type !== 'editable' && this.props.field.type !== 'indicator') return
    const {field, collection} = this.props
    if (!field.fieldName) return
    if (!collection) return
    const collectionField = collection.fields.find(cf => cf.name === field.fieldName)
    if (!collectionField) return
    const FieldComponent = fieldTypes[collectionField.type].field
    return (
      <div className={styles.fixedValue}>
        <div className="label">Valor por Defecto</div>
        <Field
          collectionFieldName={
            (collectionField.type === 'manyOf' || collectionField.type === 'oneOf') &&
            collectionField.name
          }
          fieldName={`${this.props.field.type}DefaultValue`}
          type={FieldComponent}
          {...collectionField.options}
        />
      </div>
    )
  }

  getSizeOptions() {
    return range(12).map(index => ({label: `${12 - index}/12`, value: String(12 - index)}))
  }

  renderSize() {
    if (this.props.field.type !== 'editable') return
    return (
      <div className="row">
        <div className="col-xs-12 col-sm-4">
          <div className="label">Columnas Móvil</div>
          <Field fieldName="sizeSmall" type={Select} options={this.getSizeOptions()} />
        </div>
        <div className="col-xs-12 col-sm-4">
          <div className="label">Columnas Mediano</div>
          <Field fieldName="sizeMedium" type={Select} options={this.getSizeOptions()} />
        </div>
        <div className="col-xs-12 col-sm-4">
          <div className="label">Columnas Largo</div>
          <Field fieldName="sizeLarge" type={Select} options={this.getSizeOptions()} />
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.container}>
        <div className="row">
          <div className="col-xs-12 col-sm-5 col-lg-2">
            <div className="label">Tipo</div>
            <Field fieldName="type" type={Select} options={this.getTypes()} />
          </div>
          <div className="col-xs-12 col-sm-5 col-lg-3">
            <div className="label">Campo</div>
            <Field
              fieldName="fieldName"
              type={CollectionFieldSelect}
              includeId={false}
              collectionId={this.props.form.collectionId}
            />
          </div>
          <div className="col-xs-12 col-sm-2 col-lg-2">{this.renderOptional()}</div>
          <div className="col-xs-12 col-sm-6 col-lg-3">
            {this.renderEditableLabel()}
            {this.renderFixedValue()}
            {this.renderParameterOptions()}
            {this.renderIndicatorId()}
          </div>
          <div className="col-xs-12 col-sm-6 col-lg-2">{this.renderDefault()}</div>
        </div>
        {this.renderSize()}
      </div>
    )
  }
}
