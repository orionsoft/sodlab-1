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
    itemId: PropTypes.string
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
    return fieldTypes[field.fieldType].field
  }

  getItemId() {
    return this.props.itemId
  }

  getData() {
    if (!this.props.itemData) return
    if (!this.props.itemData.item) return
    return this.props.itemData.item.data
  }

  needsData() {
    return this.props.form.type === 'update'
  }

  renderItemNotFound() {
    return <div className={styles.itemNotFound}>No se encontró el documento</div>
  }

  render() {
    const params = {data: {type: this.props.form.serializedParams}}
    if (this.needsData() && !this.getData()) return this.renderItemNotFound()
    return (
      <div className={styles.container}>
        <AutoForm
          mutation="submitForm"
          ref="form"
          only="data"
          getErrorFieldLabel={() => 'Este campo'}
          doc={{formId: this.props.form._id, data: this.getData() || {}, itemId: this.getItemId()}}
          onSuccess={this.onSuccess}>
          {({parent}) => (
            <Fields schemaToField={this.schemaToField} parent={parent} params={params} />
          )}
        </AutoForm>
        <br />
        {this.renderSubmitButton()}
      </div>
    )
  }
}
