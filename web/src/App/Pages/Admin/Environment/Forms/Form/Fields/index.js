import React from 'react'
import styles from './styles.css'
import Section from 'App/components/Section'
import Button from 'orionsoft-parts/lib/components/Button'
import AutoForm from 'App/components/AutoForm'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import {Field, WithValue} from 'simple-react-form'
import ArrayComponent from 'orionsoft-parts/lib/components/fields/ArrayComponent'
import FieldItem from './Field'
import cloneDeep from 'lodash/cloneDeep'

@withMessage
export default class Fields extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    form: PropTypes.object
  }

  state = {}

  @autobind
  getFieldsValue() {
    if (this.refs.form.form.state.value && this.refs.form.form.state.value.fields) {
      return this.refs.form.form.state.value.fields
    }
    if (this.state.reseted) return this.state.reseted
    if (this.props.form.fields) return this.props.form.fields
    return []
  }

  @autobind
  onSuccess() {
    this.props.showMessage('Los campos se guardaron correctamente')
    this.setState({reseted: null})
  }

  @autobind
  reset() {
    const reseted = this.props.form.collection.fields.map(field => {
      return {
        type: 'editable',
        fieldName: field.name,
        optional: field.optional,
        editableLabel: field.label
      }
    })
    this.setState({reseted})
  }

  @autobind
  toggleOptionals() {
    const prevOptionalToggleValue = !!this.state.optionalToggleValue
    this.setState(prevState => ({optionalToggleValue: !prevState.optionalToggleValue}))
    const fieldsValue = this.getFieldsValue()
    const reseted = fieldsValue.map(field => {
      let colField = field.fieldName
        ? this.props.form.collection.fields.find(colField => colField.name === field.fieldName)
        : {}
      const result = {
        ...(field.type && {type: field.type}),
        ...(field.fieldName && {fieldName: field.fieldName}),
        ...(field.editableLabel && {editableLabel: field.editableLabel}),
        ...(field.parameterName && {parameterName: field.parameterName}),
        optional: colField.optional && field.type !== 'fixed' && !prevOptionalToggleValue
      }
      return result
    })
    this.setState({reseted})
  }

  render() {
    return (
      <div className={styles.container}>
        <Section title="Campos" />
        <AutoForm
          mutation="setFormFields"
          ref="form"
          onSuccess={this.onSuccess}
          doc={{
            formId: this.props.form._id,
            fields: this.state.reseted || cloneDeep(this.props.form.fields) || []
          }}>
          <Field fieldName="fields" draggable={false} type={ArrayComponent}>
            <WithValue>
              {field => (
                <FieldItem
                  collection={this.props.form.collection}
                  field={field}
                  form={this.props.form}
                />
              )}
            </WithValue>
          </Field>
        </AutoForm>
        <Button onClick={this.toggleOptionals}>Cambiar Opcionales</Button>
        <Button onClick={this.reset}>Resetear</Button>
        <Button onClick={() => this.refs.form.submit()} primary>
          Guardar
        </Button>
      </div>
    )
  }
}
