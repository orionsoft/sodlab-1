import React from 'react'
import styles from './styles.css'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import Checkbox from 'App/components/fieldTypes/checkbox/Field'
import {Field} from 'simple-react-form'
import PropTypes from 'prop-types'
import CollectionFieldSelect from 'App/components/fieldTypes/collectionFieldSelect/Field'
import fieldTypes from 'App/components/fieldTypes'

export default class FormField extends React.Component {
  static propTypes = {
    field: PropTypes.object,
    form: PropTypes.object,
    collection: PropTypes.object
  }

  getTypes() {
    return [
      {value: 'fixed', label: 'Valor fijo'},
      {value: 'editable', label: 'Editable'},
      {value: 'parameter', label: 'Parametro'}
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
          typeFromForm={
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
          disabled={!element.optional || field.type === 'fixed'}
        />
      </div>
    )
  }

  render() {
    return (
      <div className={styles.container}>
        <div className="row">
          <div className="col-xs-12 col-sm-4 col-lg-3">
            <div className="label">Tipo</div>
            <Field fieldName="type" type={Select} options={this.getTypes()} />
          </div>
          <div className="col-xs-12 col-sm-4 col-lg-3">
            <div className="label">Campo</div>
            <Field
              fieldName="fieldName"
              type={CollectionFieldSelect}
              includeId={false}
              collectionId={this.props.form.collectionId}
            />
          </div>
          <div className="col-xs-12 col-sm-2 col-lg-2">{this.renderOptional()}</div>
          <div className="col-xs-12 col-sm-8 col-lg-4">
            {this.renderEditableLabel()}
            {this.renderFixedValue()}
            {this.renderParameterOptions()}
          </div>
        </div>
      </div>
    )
  }
}
