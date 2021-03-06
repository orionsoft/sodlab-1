import React from 'react'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import {Field} from 'simple-react-form'
import Checkbox from 'App/components/fieldTypes/checkbox/Field'
import PropTypes from 'prop-types'
import CollectionFieldSelect from 'App/components/fieldTypes/collectionFieldSelect/Field'
import fieldTypes from 'App/components/fieldTypes'

export default class Required extends React.Component {
  static propTypes = {
    field: PropTypes.object,
    form: PropTypes.object,
    collection: PropTypes.object,
    indicators: PropTypes.object
  }

  getRequiredTypes() {
    return [{value: 'editable', label: 'Editable'}, {value: 'parameter', label: 'Parametro'}]
  }

  renderRequiredField() {
    if (!this.props.field.requiredType || this.props.field.requiredType !== 'editable') return
    return (
      <div className="col-xs-12 col-sm-4 col-lg-4">
        <div className="label">Campo</div>
        <Field
          fieldName="requiredField"
          type={CollectionFieldSelect}
          includeId={false}
          collectionId={this.props.form.collectionId}
        />
      </div>
    )
  }

  renderRequiredFieldValue() {
    if (
      !this.props.field.requiredType ||
      this.props.field.requiredType !== 'editable' ||
      !this.props.field.requiredField
    ) {
      return
    }
    const {field, collection} = this.props
    if (!field.requiredField) return
    if (!collection) return
    const collectionField = collection.fields.find(cf => cf.name === field.requiredField)
    if (!collectionField) return
    const FieldComponent = fieldTypes[collectionField.type].field

    return (
      <div className="col-xs-12 col-sm-4 col-lg-4">
        <div className="label">Valor</div>
        <Field
          collectionFieldName={
            (collectionField.type === 'manyOf' || collectionField.type === 'oneOf') &&
            collectionField.name
          }
          fieldName="requiredValue"
          type={FieldComponent}
          {...collectionField.options}
        />
      </div>
    )
  }

  renderRequiredParameter() {
    if (!this.props.field.requiredType || this.props.field.requiredType !== 'parameter') return
    return (
      <div className="col-xs-12 col-sm-4 col-lg-4">
        <div className="label">Variable</div>
        <Field fieldName="requiredParameter" type={Text} />
      </div>
    )
  }

  selectOptions() {
    return (
      <Field
        fieldName="showField"
        value={this.props.field.showField}
        type={Checkbox}
        label={this.props.field.showField ? 'Mostrar Igual a' : 'Mostrar Diferentes a'}
      />
    )
  }

  render() {
    if (this.props.field.type !== 'editable') return null
    return (
      <div>
        {this.selectOptions()}
        <div className="row">
          <div className="col-xs-12 col-sm-4 col-lg-4">
            <div className="label">Tipo</div>
            <Field fieldName="requiredType" type={Select} options={this.getRequiredTypes()} />
          </div>
          {this.renderRequiredField()}
          {this.renderRequiredFieldValue()}
          {this.renderRequiredParameter()}
        </div>
      </div>
    )
  }
}
