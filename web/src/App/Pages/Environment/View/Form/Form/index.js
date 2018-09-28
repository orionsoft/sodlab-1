import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import AutoForm from 'App/components/AutoForm'
import Fields from 'App/components/AutoForm/Fields'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import Button from 'orionsoft-parts/lib/components/Button'
import fieldTypes from 'App/components/fieldTypes'
import autobind from 'autobind-decorator'
import schemaToField from 'App/components/schemaToField'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import cloneDeep from 'lodash/cloneDeep'
import translate from 'App/i18n/translate'
import {withRouter} from 'react-router'

@withGraphQL(gql`
  query getFormItem($formId: ID, $itemId: ID) {
    itemData: form(formId: $formId) {
      _id
      item(itemId: $itemId) {
        _id
        data
      }
    }
  }
`)
@withMessage
@withRouter
export default class Form extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    showMessage: PropTypes.func,
    form: PropTypes.object,
    state: PropTypes.object,
    itemData: PropTypes.object,
    itemId: PropTypes.string,
    parameters: PropTypes.object,
    setEnvironment: PropTypes.func,
    fields: PropTypes.array
  }

  state = {}

  renderResetButton() {
    if (!this.props.form.reset) return null
    return (
      <Button onClick={() => this.setState({data: {}})}>
        {this.props.form.resetButtonText || 'Limpiar'}
      </Button>
    )
  }

  renderSubmitButton() {
    const text = this.props.form.type === 'create' ? 'Crear' : 'Guardar'
    return (
      <Button onClick={() => this.refs.form.submit()} primary>
        {this.props.form.submitButtonText || text}
      </Button>
    )
  }

  @autobind
  onSuccess(result) {
    this.setState({data: {}})
    this.props.setEnvironment({
      [this.props.form.updateVariableName]: null
    })
    this.props.showMessage('Se completó con exito')
    const rawPath = this.props.form.onSuccessViewPath
    if (rawPath) {
      let path = rawPath
      path = path.replace(`:_id`, result._id)
      for (const key of Object.keys(result.data)) {
        const value = result.data[key]
        path = path.replace(`:${key}`, value)
      }
      this.props.history.push(path)
    }
  }

  @autobind
  schemaToField(type, field) {
    if (!field.fieldType) return schemaToField(type, field)
    if (!fieldTypes[field.fieldType]) {
      throw new Error('Field type not found for ' + field.fieldType)
    }
    return fieldTypes[field.fieldType].field
  }

  getItemId() {
    return this.props.itemId
  }

  getErrorFieldLabel() {
    return translate('general.thisField')
  }

  getItemData() {
    if (!this.props.itemData) return
    if (!this.props.itemData.item) return
    return cloneDeep(this.props.itemData.item.data)
  }

  getData() {
    const doc = this.getItemData() || {}
    const params = this.props.form.serializedParams || {}
    for (const key of Object.keys(params)) {
      const field = params[key]
      if (field.formFieldType === 'parameter') {
        doc[key] = this.props.parameters[field.parameterName]
      }
    }
    return doc
  }

  getParams() {
    const schema = cloneDeep(this.props.form.serializedParams) || {}
    for (const key of Object.keys(schema)) {
      const field = schema[key]
      if (field.formFieldType !== 'editable') {
        delete schema[key]
      }
    }
    const params = {data: {type: schema}}
    return params
  }

  needsData() {
    return this.props.form.type === 'update'
  }

  renderItemNotFound() {
    return <div className={styles.itemNotFound}>No se encontró el documento</div>
  }

  render() {
    if (this.needsData() && !this.getItemData()) return this.renderItemNotFound()
    return (
      <div className={styles.container}>
        <AutoForm
          mutation="submitForm"
          ref="form"
          only="data"
          getErrorFieldLabel={this.getErrorFieldLabel}
          doc={{
            formId: this.props.form._id,
            data: this.getData(),
            itemId: this.getItemId()
          }}
          onSuccess={this.onSuccess}>
          <Fields
            schemaToField={this.schemaToField}
            params={this.getParams()}
            passProps={{formId: this.props.form._id}}
            fields={this.props.fields}
          />
        </AutoForm>
        <br />
        {this.renderResetButton()}
        {this.renderSubmitButton()}
      </div>
    )
  }
}
