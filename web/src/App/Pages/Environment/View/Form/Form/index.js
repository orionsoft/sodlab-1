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
export default class Form extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    form: PropTypes.object,
    state: PropTypes.object,
    itemData: PropTypes.object,
    itemId: PropTypes.string,
    parameters: PropTypes.object
  }

  state = {}

  renderSubmitButton() {
    const text = this.props.form.type === 'create' ? 'Crear' : 'Guardar'
    return (
      <Button onClick={() => this.refs.form.submit()} primary>
        {text}
      </Button>
    )
  }

  @autobind
  onSuccess() {
    this.setState({data: {}})
    this.props.showMessage('Se completó con exito')
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

  getItemData() {
    if (!this.props.itemData) return
    if (!this.props.itemData.item) return
    return cloneDeep(this.props.itemData.item.data)
  }

  getData() {
    const {currentUser} = this.props.parameters
    const doc = this.getItemData() || {}
    const params = this.props.form.serializedParams || {}
    for (const key of Object.keys(params)) {
      const field = params[key]
      if (field.formFieldType === 'fixed') {
        doc[key] = field.defaultValue
      }
      if (field.formFieldType === 'parameter') {
        doc[key] = currentUser[field.parameterName] ? currentUser[field.parameterName] : 'noData'
      }
    }
    return doc
  }

  getParams() {
    const schema = cloneDeep(this.props.form.serializedParams) || {}
    for (const key of Object.keys(schema)) {
      const field = schema[key]
      if (field.formFieldType === 'fixed') {
        delete schema[key]
      }
      if (field.formFieldType === 'parameter') {
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
          getErrorFieldLabel={() => translate('general.thisField')}
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
          />
        </AutoForm>
        <br />
        {this.renderSubmitButton()}
      </div>
    )
  }
}
