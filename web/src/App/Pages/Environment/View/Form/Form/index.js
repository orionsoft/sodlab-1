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
import isEqual from 'lodash/isEqual'
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
    fields: PropTypes.array,
    timezone: PropTypes.string
  }

  state = {
    docData: {},
    formUpdateVariableValue: ''
  }

  componentDidMount() {
    this.setState({docData: this.getData()})
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.parameters, prevProps.parameters)) {
      const currentDoc = this.state.docData
      const newParams = this.getData()
      this.setState({docData: {...currentDoc, ...newParams}})
    }
  }

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

  setEnvironmentVariables({_id, data}) {
    let environmentVariables = {...this.props.parameters}
    if (this.props.form.updateVariableName) {
      environmentVariables = {
        ...environmentVariables,
        [this.props.form.updateVariableName]: this.state.formUpdateVariableValue
      }
    }

    const {onSuccessEnvironmentVariables} = this.props.form
    if (!onSuccessEnvironmentVariables || onSuccessEnvironmentVariables.length === 0)
      return this.props.setEnvironment(environmentVariables)

    for (const field of onSuccessEnvironmentVariables) {
      if (field === '_id') {
        environmentVariables = {...environmentVariables, [field]: _id}
      } else if (Object.keys(data).includes(field)) {
        environmentVariables = {...environmentVariables, [field]: data[field]}
      }
    }
    this.props.setEnvironment(environmentVariables)
  }

  parseUrl(url, result) {
    const viewParameters = Object.keys(this.props.parameters)
    const resultData = {_id: result._id, ...result.data}
    const resultParameters = Object.keys(resultData)
    return new Promise((resolve, reject) => {
      let path = url
      const pathVars = path
        .split('/')
        .filter(key => /^:/.test(key))
        .map(key => key.replace(':', ''))
      if (!pathVars || pathVars.length === 0) resolve(path)

      const missingKeys = []
      const allKeysIncluded = pathVars.every(key => {
        if (viewParameters.includes(key) || resultParameters.includes(key)) {
          return true
        } else {
          missingKeys.push(key)
          return false
        }
      })
      if (!allKeysIncluded) {
        reject(missingKeys)
      }

      for (const key of resultParameters) {
        const value = resultData[key]
        path = path.replace(`:${key}`, value)
      }
      for (const key of viewParameters) {
        const value = this.props.parameters[key]
        path = path.replace(`:${key}`, value)
      }
      resolve(path)
    })
  }

  @autobind
  async onSuccess(result) {
    this.setState({
      docData: {},
      formUpdateVariableValue: this.props.parameters[this.props.form.updateVariableName]
    })
    this.props.setEnvironment({
      [this.props.form.updateVariableName]: null
    })
    this.setEnvironmentVariables(result)
    this.setState({docData: this.getData()})

    const rawPath = this.props.form.onSuccessViewPath
    if (rawPath) {
      let path = rawPath
      path = path.replace(`:_id`, result._id)
      try {
        path = await this.parseUrl(path, result)
        this.props.history.push(path)
      } catch (missingKeys) {
        console.log(`Missing the following params ${missingKeys.join('-')}`)
      }
    }
    this.props.showMessage('Se completó con éxito')
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

  @autobind
  getParams() {
    const schema = cloneDeep(this.props.form.serializedParams) || {}

    Object.keys(schema)
      .map(key => {
        const field = schema[key]
        return {
          ...field,
          key
        }
      })
      .filter(field => field.formFieldType === 'editable')
      .map(field => {
        // remove fields
        if (
          field.requiredValue === this.state.docData[field.requiredField] &&
          field.requiredType !== null
        ) {
          if (!field.showField) {
            delete schema[field.key]
            return field
          } else {
            schema[field.key] = field
            return field
          }
        } else {
          if (field.showField) {
            delete schema[field.key]
            return field
          } else {
            schema[field.key] = field
            return field
          }
        }
      })

    let formData = this.state.docData
    let formDataKeys = Object.keys(formData)
    let schemaKeys = Object.keys(schema)
    if (!formDataKeys.every(key => schemaKeys.includes(key))) {
      for (const key of formDataKeys) {
        if (!schemaKeys.includes(key)) {
          delete formData[key]
        }
      }
      this.setState({docData: formData})
    }

    const params = {
      data: {
        type: schema
      }
    }

    return params
  }

  needsData() {
    return this.props.form.type === 'update'
  }

  renderItemNotFound() {
    return <div className={styles.itemNotFound}>No se encontró el documento</div>
  }

  filterFields() {
    return this.props.fields
  }

  @autobind
  onChange(docData) {
    this.setState({docData})
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
          onChange={changes => this.onChange(changes.data)}
          doc={{
            formId: this.props.form._id,
            data: this.state.docData,
            itemId: this.getItemId()
          }}
          onSuccess={this.onSuccess}>
          <Fields
            fromEnvironment
            schemaToField={this.schemaToField}
            params={this.getParams()}
            passProps={{formId: this.props.form._id}}
            fields={this.filterFields()}
            timezone={this.props.timezone}
          />
        </AutoForm>
        <br />
        {this.renderResetButton()}
        {this.renderSubmitButton()}
      </div>
    )
  }
}
